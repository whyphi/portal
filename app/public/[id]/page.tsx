"use client"
import React, { useState, useEffect } from "react";
import Form from "@/components/Form";
import Loader from "@/components/Loader";
import {useRouter} from "next/navigation";

interface Listing {
  deadline: string;
  listingId: string;
  questions: [] | [{ question: string; context: string }];
  title: string;
}

interface ServerError {
  Code: string;
  Message: string;
}

export default function Listing({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<Listing>({
    deadline: "",
    listingId: "",
    questions: [],
    title: "",
  });

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then((data: Listing | ServerError) => {
        if ("Code" in data && data.Code === "InternalServerError") {
          console.error("Server error:", data.Message);
        } else {
          setListingData(data as Listing);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        router.push("/error")
      });
  }, [params.id]);

  return isLoading ? (
    <Loader />
  ) : (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={listingData.title}
        questions={listingData.questions}
        listingId={listingData.listingId}
      />
    </main>
  );
}
