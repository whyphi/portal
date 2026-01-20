"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert } from "flowbite-react";
import Loader from "@/components/Loader";

export default function RushAutoCheckIn({
  params,
}: {
  params: { timeframeId: string; eventId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const code = searchParams.get("code");

  const performCheckIn = useCallback(async () => {
    if (!code || !session?.token?.id) {
      setError(new Error("Missing required information for check-in"));
      setIsCheckingIn(false);
      return;
    }

    setIsCheckingIn(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/checkin/${params.eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            rusheeId: session.token.id,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.Message || "Failed to check in");
      }

      router.push("/checkin/success");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      setIsCheckingIn(false);
    }
  }, [code, session, params.eventId, router]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    setIsLoading(false);

    if (status === "unauthenticated" || !session) {
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }
    
    if (code && session?.token?.id) {
      performCheckIn();
    }
  }, [status, session, code, router, performCheckIn]);

  if (isLoading || status === "loading") {
    return <Loader />;
  }

  if (isCheckingIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Checking you in...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6">
        {error && (
          <Alert color="failure">
            <span className="font-bold">Error checking in.</span> {error.message}
          </Alert>
        )}
        {!code && (
          <Alert color="warning">
            <span className="font-bold">Missing code.</span> The QR code is missing the check-in code.
          </Alert>
        )}
        {code && !error && !isCheckingIn && (
          <Alert color="info">
            <span className="font-bold">Preparing check-in...</span> Please wait.
          </Alert>
        )}
      </div>
    </div>
  );
}

