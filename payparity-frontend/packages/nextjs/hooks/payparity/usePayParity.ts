"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAllow, useEncrypt, useIsAllowed, useUserDecrypt } from "@zama-fhe/react-sdk";
import { ZERO_HANDLE, ZamaSDKEvents } from "@zama-fhe/sdk";
import { bytesToHex } from "viem";
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { PayParity } from "~~/contracts/PayParity";
import { deploymentFor } from "~~/utils/contract";

export const usePayParity = (categoryId: number) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const payParity = useMemo(() => deploymentFor(PayParity, chainId), [chainId]);

  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const hasContract = Boolean(payParity?.address && payParity?.abi);

  const countResult = useReadContract({
    address: hasContract ? payParity!.address : undefined,
    abi: hasContract ? payParity!.abi : undefined,
    functionName: "getCategoryCount" as const,
    args: [categoryId],
    query: { enabled: Boolean(hasContract && isConnected), refetchOnWindowFocus: false },
  });

  const categoryCount = useMemo(() => {
    const v = countResult.data as number | undefined;
    return typeof v === "number" ? v : 0;
  }, [countResult.data]);

  const sumResult = useReadContract({
    address: hasContract ? payParity!.address : undefined,
    abi: hasContract ? payParity!.abi : undefined,
    functionName: "getEncryptedSum" as const,
    args: [categoryId],
    query: { enabled: Boolean(hasContract && isConnected), refetchOnWindowFocus: false },
  });

  const sumHandle = useMemo(() => (sumResult.data as string | undefined) ?? undefined, [sumResult.data]);

  const refreshData = useCallback(async () => {
    await countResult.refetch();
    await sumResult.refetch();
  }, [countResult, sumResult]);

  const encrypt = useEncrypt();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  useEffect(() => {
    const ctrl = new AbortController();
    const { CredentialsCached, DecryptEnd } = ZamaSDKEvents;
    window.addEventListener(CredentialsCached, () => setMessage("Credentials ready, revealing..."), { signal: ctrl.signal });
    window.addEventListener(DecryptEnd, () => setMessage("Reveal complete!"), { signal: ctrl.signal });
    return () => ctrl.abort();
  }, []);

  const decryptHandles = useMemo(() => {
    if (!sumHandle || sumHandle === ZERO_HANDLE || !payParity?.address) return [];
    return [{ handle: sumHandle as `0x${string}`, contractAddress: payParity.address }];
  }, [sumHandle, payParity?.address]);

  const { mutate: allow, isPending: isAllowing } = useAllow();
  const contractAddr = (payParity?.address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;
  const { data: isAllowed } = useIsAllowed({ contractAddresses: [contractAddr] });

  const [revealEnabled, setRevealEnabled] = useState(false);

  const decrypt = useUserDecrypt({ handles: decryptHandles }, { enabled: revealEnabled && !!isAllowed });

  const decryptedSum = useMemo(() => {
    if (!sumHandle || !decrypt.data) return undefined;
    return decrypt.data[sumHandle as `0x${string}`];
  }, [sumHandle, decrypt.data]);

  const isRevealed = decryptedSum !== undefined;
  const isRevealing = decrypt.isFetching;

  const averageSalary = useMemo(() => {
    if (decryptedSum === undefined || categoryCount === 0) return undefined;
    return Number(decryptedSum) / categoryCount;
  }, [decryptedSum, categoryCount]);

  const PRIVACY_THRESHOLD = 5;
  const isRevealReady = categoryCount >= PRIVACY_THRESHOLD;

  const canReveal = Boolean(
    hasContract && isConnected && address && sumHandle && sumHandle !== ZERO_HANDLE &&
    isRevealReady && !isRevealed && !isRevealing && !isAllowing,
  );

  const canSubmit = Boolean(hasContract && isConnected && address && !isProcessing);

  const revealAverage = useCallback(async () => {
    if (!canReveal || !sumHandle || !payParity?.address) return;
    try {
      if (!revealEnabled) {
        // STEP 1: ask the contract for on-chain decrypt permission.
        // The contract enforces require(count >= 5) here, so the privacy
        // threshold is guaranteed on-chain, not just in the UI.
        setMessage("Requesting on-chain permission (threshold check)...");
        const hash = await writeContractAsync({
          address: payParity.address,
          abi: payParity.abi,
          functionName: "allowReveal",
          args: [categoryId],
          gas: 2_000_000n,
        });
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
        await refreshData();
        setRevealEnabled(true);
      }
      // STEP 2: sign the relayer authorization; decryption then runs automatically.
      if (!isAllowed) {
        setMessage("Authorizing reveal...");
        allow([payParity.address]);
        return;
      }
      setMessage("Revealing benchmark...");
    } catch (e) {
      setMessage(`Reveal failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [canReveal, sumHandle, payParity, categoryId, revealEnabled, isAllowed, allow, writeContractAsync, publicClient, refreshData]);

  useEffect(() => {
    if (decrypt.error) setMessage(`Reveal failed: ${decrypt.error.message}`);
  }, [decrypt.error]);

  const submitSalary = useCallback(
    async (salary: number) => {
      if (isProcessing || !canSubmit || salary <= 0 || !payParity?.address || !address) return;
      setIsProcessing(true);
      setMessage("Submitting your salary privately...");
      try {
        setMessage("Encrypting your salary...");
        const enc = await encrypt.mutateAsync({
          values: [{ value: BigInt(Math.floor(salary)), type: "euint32" }],
          contractAddress: payParity.address,
          userAddress: address,
        });
        setMessage("Sending encrypted transaction...");
        await writeContractAsync({
          address: payParity.address,
          abi: payParity.abi,
          functionName: "submitSalary",
          args: [categoryId, bytesToHex(enc.handles[0]!), bytesToHex(enc.inputProof)],
          gas: 2_000_000n,
        });
        setMessage("Salary submitted! Your individual value stays private.");
        await refreshData();
      } catch (e) {
        setMessage(`Submit failed: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, canSubmit, payParity, address, categoryId, encrypt, writeContractAsync, refreshData],
  );

  return {
    contractAddress: payParity?.address,
    categoryCount,
    sumHandle,
    canSubmit,
    submitSalary,
    canReveal,
    revealAverage,
    refreshData,
    isRevealReady,
    isRevealed,
    isRevealing,
    decryptedSum: decryptedSum !== undefined ? Number(decryptedSum) : undefined,
    averageSalary,
    isProcessing,
    isRefreshing: countResult.isFetching || sumResult.isFetching,
    message,
  };
};