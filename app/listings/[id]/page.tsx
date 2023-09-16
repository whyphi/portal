"use client"
import React, { useState, useEffect } from "react";
import Form from "@/components/Form";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import useSWR from 'swr';

interface Listing {
  deadline: string;
  listingId: string;
  questions: [] | [{ question: string; context: string }];
  title: string;
}


export default function Listing({ params }: { params: { id: string } }) {
  const router = useRouter()

  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`, fetcher)

  if (error) router.push("/error")

  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<Listing>({
    deadline: "",
    listingId: "",
    questions: [],
    title: "",
  });


  return isLoading ? (
    <Loader />
  ) : (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={data.title}
        questions={data.questions}
        listingId={data.listingId}
      />
    </main>
  );
}
