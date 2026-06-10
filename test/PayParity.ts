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
    const count = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(count).to.eq(0);
  });

  it("total submissions should be zero after deployment", async function () {
    const total = await payParityContract.totalSubmissions();
    expect(total).to.eq(0);
  });

  it("reveal should not be ready before threshold", async function () {
    const ready = await payParityContract.isRevealReady(CATEGORY_ID);
    expect(ready).to.eq(false);
  });

  it("should accept an encrypted salary submission and increase the category count", async function () {
    const countBefore = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(countBefore).to.eq(0);

    const clearSalary = 10;
    const encryptedSalary = await fhevm
      .createEncryptedInput(payParityContractAddress, signers.alice.address)
      .add32(clearSalary)
      .encrypt();

    const tx = await payParityContract
      .connect(signers.alice)
      .submitSalary(CATEGORY_ID, encryptedSalary.handles[0], encryptedSalary.inputProof);
    await tx.wait();

    const countAfter = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(countAfter).to.eq(1);
  });

  it("should correctly sum two encrypted salaries in the same category", async function () {
    const aliceSalary = 10;
    const encryptedAlice = await fhevm
      .createEncryptedInput(payParityContractAddress, signers.alice.address)
      .add32(aliceSalary)
      .encrypt();

    let tx = await payParityContract
      .connect(signers.alice)
      .submitSalary(CATEGORY_ID, encryptedAlice.handles[0], encryptedAlice.inputProof);
    await tx.wait();

    const bobSalary = 20;
    const encryptedBob = await fhevm
      .createEncryptedInput(payParityContractAddress, signers.bob.address)
      .add32(bobSalary)
      .encrypt();

    tx = await payParityContract
      .connect(signers.bob)
      .submitSalary(CATEGORY_ID, encryptedBob.handles[0], encryptedBob.inputProof);
    await tx.wait();

    const count = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(count).to.eq(2);

    const encryptedSum = await payParityContract.getEncryptedSum(CATEGORY_ID);
    const clearSum = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedSum,
      payParityContractAddress,
      signers.bob,
    );

    expect(clearSum).to.eq(aliceSalary + bobSalary);
  });

  it("should keep categories separate", async function () {
    const OTHER_CATEGORY = 21;

    const enc1 = await fhevm
      .createEncryptedInput(payParityContractAddress, signers.alice.address)
      .add32(10)
      .encrypt();
    let tx = await payParityContract
      .connect(signers.alice)
      .submitSalary(CATEGORY_ID, enc1.handles[0], enc1.inputProof);
    await tx.wait();

    const otherCount = await payParityContract.getCategoryCount(OTHER_CATEGORY);
    expect(otherCount).to.eq(0);

    const thisCount = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(thisCount).to.eq(1);
  });

  it("reveal should become ready after threshold submissions", async function () {
    for (let i = 0; i < 5; i++) {
      const encrypted = await fhevm
        .createEncryptedInput(payParityContractAddress, signers.alice.address)
        .add32(10 + i)
        .encrypt();

      const tx = await payParityContract
        .connect(signers.alice)
        .submitSalary(CATEGORY_ID, encrypted.handles[0], encrypted.inputProof);
      await tx.wait();
    }

    const count = await payParityContract.getCategoryCount(CATEGORY_ID);
    expect(count).to.eq(5);

    const ready = await payParityContract.isRevealReady(CATEGORY_ID);
    expect(ready).to.eq(true);
  });
});
