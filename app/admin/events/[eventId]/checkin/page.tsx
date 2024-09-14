"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { AdminTextStyles, DimmedAdminTextStyles } from "@/styles/TextStyles";
import { Alert, Badge, Button, TextInput } from "flowbite-react";
import Loader from "@/components/AdminLoader";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";

export default function CheckInPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const eventId = searchParams.get("eventId");
  const eventName = searchParams.get("eventName");

  useEffect(() => {
    if (session?.user) setIsLoading(false);
  }, [session]);

  const handleSubmit = () => {
    setIsButtonDisabled(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/checkin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        name: session?.user?.name,
        email: session?.user?.email,
      }),
    })
      .then(async (res) => {
        setIsButtonDisabled(false);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.Message);
        }
        return res.json();
      })
      .then((data) => {
        // router.push("/checkin/success");
      })
      .catch((err) => {
        setError(err);
        setIsButtonDisabled(false);
      });
  };

  // const AlertComponent = () => {
  //   return (
  //     error && (
  //       <Alert
  //         variant="destructive"
  //         className="absolute top-0 left-0 w-full m-4 bg-white z-50"
  //       >
  //         {/* <AlertCircle className="h-4 w-4" /> */}
  //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 lucide lucide-circle-alert"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
  //         <AlertTitle>Error</AlertTitle>
  //         <AlertDescription>
  //           {error.message}
  //         </AlertDescription>
  //         <button
  //           type="button"
  //           className="absolute top-1 right-1 text-gray-500 hover:text-gray-800 focus:outline-none"
  //           onClick={() => {
  //             setError(null);

  //           }}
  //         >
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             width="24"
  //             height="24"
  //             viewBox="0 0 24 24"
  //             fill="none"
  //             stroke="currentColor"
  //             stroke-width="2"
  //             stroke-linecap="round"
  //             stroke-linejoin="round"
  //             className="m-1 h-4 w-4 lucide lucide-x"
  //           >
  //             <path d="M18 6 6 18" />
  //             <path d="m6 6 12 12" />
  //           </svg>
  //         </button>
  //       </Alert>
  //     )
  //   )
  // }

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <Link href={`/admin/events/${eventId}`} passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>

      <h1 className={AdminTextStyles.subtitle}>{eventName}</h1>
      <p className={DimmedAdminTextStyles.default}>
        Enter the event code to get checked in to this event!
      </p>

      <div className="flex flex-col">
        <p className="flex items-center gap-1 text-gray-600 dark:text-white text-md">
          Please enter your code to check-in to <Badge>{eventName}</Badge>:
        </p>
        <div className="flex items-center space-x-2 mt-2 mb-8">
          <TextInput
            className="w-full"
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <Button
          className="w-24"
          type="submit"
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          color="purple"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
