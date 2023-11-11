"use client"

import React from "react";
import Form from "@/components/Form";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface ListingData {
  title: string;
  questions: [] | [{ question: string; context: string }];
  listingId: string;
  deadline: string;
}

export default function Listing({ params }: { params: { id: string } }) {
  const router = useRouter();

  const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  };

  const { data, error, isValidating } = useSWR<ListingData>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`,
    fetcher
  );

  if (error) {
    router.push("/error");
  }

  if (!data || isValidating) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={data.title}
        questions={data.questions}
        listingId={data.listingId}
      />
    </main>
  );
}
