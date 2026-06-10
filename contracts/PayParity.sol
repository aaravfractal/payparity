// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PayParity is ZamaEthereumConfig {
    uint32 public constant PRIVACY_THRESHOLD = 5;

    struct Category {
        euint32 encryptedSum;
        uint32 count;
    }

    mapping(uint32 => Category) private _categories;
    uint32 public totalSubmissions;

    event SalarySubmitted(address indexed contributor, uint32 indexed categoryId, uint32 newCategoryCount);
    event RevealAuthorized(address indexed requester, uint32 indexed categoryId);

    function submitSalary(
        uint32 categoryId,
        externalEuint32 inputEuint32,
        bytes calldata inputProof
    ) external {
        euint32 encryptedSalary = FHE.fromExternal(inputEuint32, inputProof);
        Category storage cat = _categories[categoryId];
        cat.encryptedSum = FHE.add(cat.encryptedSum, encryptedSalary);
        cat.count += 1;
        totalSubmissions += 1;

        FHE.allowThis(cat.encryptedSum);

        emit SalarySubmitted(msg.sender, categoryId, cat.count);
    }

    function allowReveal(uint32 categoryId) external {
        Category storage cat = _categories[categoryId];
        require(cat.count >= PRIVACY_THRESHOLD, "PayParity: below privacy threshold");
        FHE.allow(cat.encryptedSum, msg.sender);
        emit RevealAuthorized(msg.sender, categoryId);
    }

    function getEncryptedSum(uint32 categoryId) external view returns (euint32) {
        return _categories[categoryId].encryptedSum;
    }

    function getCategoryCount(uint32 categoryId) external view returns (uint32) {
        return _categories[categoryId].count;
    }

    function isRevealReady(uint32 categoryId) external view returns (bool) {
        return _categories[categoryId].count >= PRIVACY_THRESHOLD;
    }
}