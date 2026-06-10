"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { PayParity } from "~~/contracts/PayParity";
import { deploymentFor } from "~~/utils/contract";
import { getTargetNetworks } from "~~/utils/helper";

const SEPOLIA_CHAIN_ID = getTargetNetworks().find(n => n.id === 11155111)?.id ?? 11155111;

/**
 * Reads PayParity.totalSubmissions() for live social proof.
 * Does not depend on wallet connection.
 */
export const useTotalSubmissions = () => {
  const payParity = useMemo(() => deploymentFor(PayParity, SEPOLIA_CHAIN_ID), []);
  const hasContract = Boolean(payParity?.address && payParity?.abi);

  const result = useReadContract({
    address: hasContract ? payParity!.address : undefined,
    abi: hasContract ? payParity!.abi : undefined,
    functionName: "totalSubmissions" as const,
    chainId: SEPOLIA_CHAIN_ID,
    query: {
      enabled: hasContract,
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    },
  });

  const total = useMemo(() => {
    const v = result.data as number | undefined;
    return typeof v === "number" ? v : 0;
  }, [result.data]);

  return { total, isLoading: result.isLoading };
};
