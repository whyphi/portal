"use client"

import { useSearchParams } from 'next/navigation'

export default function AuthError() {

  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');
  var errorMessage;

  if (errorType === "AccessDenied") {
    errorMessage = "Access Denied";
  } else {
    errorMessage = errorType;
  }

  return (
    <main className="flex flex-col mx-auto justify-center items-center min-h-screen max-w-screen-sm px-5 py-2.5">
      <h1 className="text-4xl font-bold mb-2">{errorMessage}</h1>
      <h3 className="mb-4 text-md font-extralight text-gray-500">You do not have permission to sign in.</h3>
    </main>
  );
}
