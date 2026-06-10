import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PayParity, PayParity__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

const CATEGORY_ID = 13;

async function deployFixture() {
  const factory = (await ethers.getContractFactory("PayParity")) as PayParity__factory;
  const payParityContract = (await factory.deploy()) as PayParity;
  const payParityContractAddress = await payParityContract.getAddress();
  return { payParityContract, payParityContractAddress };
}

describe("PayParity", function () {
  let signers: Signers;
  let payParityContract: PayParity;
  let payParityContractAddress: string;

  async function submit(signer: HardhatEthersSigner, value: number) {
    const enc = await fhevm
      .createEncryptedInput(payParityContractAddress, signer.address)
      .add32(value)
      .encrypt();
    const tx = await payParityContract
      .connect(signer)
      .submitSalary(CATEGORY_ID, enc.handles[0], enc.inputProof);
    await tx.wait();
  }

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }
    ({ payParityContract, payParityContractAddress } = await deployFixture());
  });

  it("category count should be zero after deployment", async function () {
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(0);
  });

  it("total submissions should be zero after deployment", async function () {
    expect(await payParityContract.totalSubmissions()).to.eq(0);
  });

  it("reveal should not be ready before threshold", async function () {
    expect(await payParityContract.isRevealReady(CATEGORY_ID)).to.eq(false);
  });

  it("should accept an encrypted salary submission and increase the category count", async function () {
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(0);
    await submit(signers.alice, 10);
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(1);
  });

  it("should keep categories separate", async function () {
    const OTHER_CATEGORY = 21;
    await submit(signers.alice, 10);
    expect(await payParityContract.getCategoryCount(OTHER_CATEGORY)).to.eq(0);
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(1);
  });

  it("reveal should become ready after threshold submissions", async function () {
    for (let i = 0; i < 5; i++) {
      await submit(signers.alice, 10 + i);
    }
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(5);
    expect(await payParityContract.isRevealReady(CATEGORY_ID)).to.eq(true);
  });

  it("allowReveal should REVERT below the privacy threshold (the privacy guarantee)", async function () {
    // Only 3 submissions, below the threshold of 5.
    for (let i = 0; i < 3; i++) {
      await submit(signers.alice, 100);
    }
    await expect(
      payParityContract.connect(signers.alice).allowReveal(CATEGORY_ID),
    ).to.be.revertedWith("PayParity: below privacy threshold");
  });

  it("should sum encrypted salaries and decrypt the aggregate ONLY after reveal is authorized at threshold", async function () {
    const salaries = [10, 20, 30, 40, 50]; // sum = 150
    for (const s of salaries) {
      await submit(signers.alice, s);
    }
    expect(await payParityContract.getCategoryCount(CATEGORY_ID)).to.eq(5);

    // Threshold met: allowReveal grants the caller decrypt access on the aggregate sum.
    const tx = await payParityContract.connect(signers.alice).allowReveal(CATEGORY_ID);
    await tx.wait();

    const encryptedSum = await payParityContract.getEncryptedSum(CATEGORY_ID);
    const clearSum = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedSum,
      payParityContractAddress,
      signers.alice,
    );
    expect(clearSum).to.eq(150);
  });
});
