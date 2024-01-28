"use client"

import React, { useState, useEffect } from "react";
import Form from "@/components/Form";
import Loader from "@/components/Loader";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";

interface PreviewListingData {
  title: string;
  questions: [] | [{ question: string; context: string }];
  deadline: string;
  includeEventsAttended: boolean;
  dateCreated: string;
}


export default function previewListing() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<PreviewListingData>({
    deadline: "",
    dateCreated: "",
    questions: [],
    title: "",
    includeEventsAttended: false
  });

  function unflattenQuestions(urlSearchParams: ReadonlyURLSearchParams): { [key: string]: string }[] {
    // Extract parameters with names starting with 'questions'
    const questionParams = Array.from(urlSearchParams.entries())
      .filter(([paramName]) => paramName.startsWith('questions'))
      .reduce((acc, [paramName, paramValue]) => {
        const [index, key] = (paramName.match(/\[(\d+)\]\.(.+)/)?.slice(1) || []) as [number, string];
        if (!acc[index]) {
          acc[index] = {};
        }
        acc[index][key] = paramValue;
        return acc;
      }, [] as { [key: string]: string }[]);

    return questionParams;
  }

  useEffect(() => {
    const deadline = searchParams.get('deadline') ?? ''
    const dateCreated = searchParams.get('dateCreated') ?? ''
    const questions = unflattenQuestions(searchParams) ?? []
    const title = searchParams.get('title') ?? ''
    const includeEventsAttended = searchParams.get('includeEventsAttended') == "true"  // boof as hell

    // BUG this keeps going forever and ever and ever
    setListingData({
      deadline: deadline,
      dateCreated: dateCreated,
      questions: questions,
      title: title,
      includeEventsAttended: includeEventsAttended
    })

  })



  // useEffect(() => {
  //   // Fetch listings data from your /listings API endpoint
  //   fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("API request failed");
  //       }

  //       return response.json();
  //     })
  //     .then((data: ListingData | ServerError) => {
  //       if ("Code" in data && data.Code === "InternalServerError") {
  //         console.error("Server error:", data.Message);
  //       } else {
  //         setListingData(data as ListingData);
  //       }
  //       const listing = data as ListingData;

  //       // Check if the retrieved data is a valid ListingData
  //       if ("deadline" in data) {
  //         // Check if the deadline is a valid date
  //         const deadline = new Date(listing.deadline);
  //         if (!isNaN(deadline.getTime())) {
  //           const now = new Date();
  //           const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

  //           if (estNow > deadline) {
  //             router.push("/error");
  //             return;
  //           }
  //         } else {
  //           router.push("/error");
  //           return;
  //         }
  //       }

  //       // Check if listing is visible
  //       if (!listing.isVisible) {
  //         router.push("/error");
  //         return;
  //       }


  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching listings:", error);
  //       router.push("/error")
  //     });
  // }, []);

  // if (isLoading) return <Loader />

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={listingData.title}
        questions={listingData.questions}
        listingId={null}
        includeEventsAttended={listingData.includeEventsAttended}
      />
    </main>
  );
}
