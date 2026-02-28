"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "next-auth/react";
import { Alert } from "flowbite-react";
import Loader from "@/components/Loader";

export default function AutoCheckIn({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { data: session, status } = useSession();
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasAttemptedCheckInRef = useRef<boolean>(false);

  const code = searchParams.get("code");

  const performCheckIn = useCallback(async () => {
    if (hasAttemptedCheckInRef.current || isCheckingIn) {
      return;
    }

    if (!code || !token || !session?.token?.id) {
      setError(new Error("Missing required information for check-in"));
      setIsCheckingIn(false);
      return;
    }

    hasAttemptedCheckInRef.current = true;
    setIsCheckingIn(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${params.eventId}/checkin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session.token.id,
            code: code,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        const errorMessage = err.Message || "Failed to check in";
        throw new Error(errorMessage);
      }

      router.push(`/admin/events/${params.eventId}/success`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(new Error(errorMessage));
      setIsCheckingIn(false);
      
      if (!errorMessage.toLowerCase().includes("already checked in")) {
        hasAttemptedCheckInRef.current = false;
      }
    }
  }, [code, token, session, params.eventId, router, isCheckingIn]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    setIsLoading(false);

    if (status === "unauthenticated" || !session) {
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (!token) {
      return;
    }

    if (code && token && session?.token?.id && !hasAttemptedCheckInRef.current) {
      performCheckIn();
    }
  }, [status, session, token, code, router, performCheckIn]);

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