/**
 * PayParity deployed contract (Sepolia).
 * Mirrors the FHECounter.ts pattern used by this template.
 * Import by name: import { PayParity } from "~~/contracts/PayParity";
 */
import type { ContractDeployment } from "~~/utils/contract";

const REMOTE = {
  11155111: {
    address: "0xE48C7CcEB4dA68FA71ccEB94a7d8146Ba4a62523",
    abi: [
      {
        type: "error",
        name: "SenderNotAllowedToUseHandle",
        inputs: [
          { name: "handle", type: "bytes32", internalType: "bytes32" },
          { name: "sender", type: "address", internalType: "address" },
        ],
      },
      {
        type: "error",
        name: "ZamaProtocolUnsupported",
        inputs: [],
      },
      {
        type: "event",
        name: "SalarySubmitted",
        anonymous: false,
        inputs: [
          { name: "contributor", type: "address", indexed: true, internalType: "address" },
          { name: "categoryId", type: "uint32", indexed: true, internalType: "uint32" },
          { name: "newCategoryCount", type: "uint32", indexed: false, internalType: "uint32" },
        ],
      },
      {
        type: "event",
        name: "RevealAuthorized",
        anonymous: false,
        inputs: [
          { name: "requester", type: "address", indexed: true, internalType: "address" },
          { name: "categoryId", type: "uint32", indexed: true, internalType: "uint32" },
        ],
      },
      {
        type: "function",
        name: "PRIVACY_THRESHOLD",
        inputs: [],
        outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "allowReveal",
        inputs: [{ name: "categoryId", type: "uint32", internalType: "uint32" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "confidentialProtocolId",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getCategoryCount",
        inputs: [{ name: "categoryId", type: "uint32", internalType: "uint32" }],
        outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getEncryptedSum",
        inputs: [{ name: "categoryId", type: "uint32", internalType: "uint32" }],
        outputs: [{ name: "", type: "bytes32", internalType: "euint32" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "isRevealReady",
        inputs: [{ name: "categoryId", type: "uint32", internalType: "uint32" }],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "submitSalary",
        inputs: [
          { name: "categoryId", type: "uint32", internalType: "uint32" },
          { name: "inputEuint32", type: "bytes32", internalType: "externalEuint32" },
          { name: "inputProof", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "totalSubmissions",
        inputs: [],
        outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
        stateMutability: "view",
      },
    ],
    deployedOnBlock: 11028783,
  },
} as const;

export const PayParity = {
  ...REMOTE,
} as const satisfies Partial<Record<number, ContractDeployment>>;