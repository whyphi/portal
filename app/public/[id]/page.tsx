"use client";

import React, { useState, useEffect } from "react";
import Form from "@/components/Form";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { Listing as ListingData } from "@/types/listing";

interface ServerError {
  Code: string;
  Message: string;
}

export default function Listing({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<ListingData>({
    date_created: "",
    deadline: "",
    id: "",
    questions: [],
    title: "",
    is_visible: true,
    include_events_attended: false,
    is_encrypted: false,
    active: true,
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
      .then((data: ListingData | ServerError) => {
        if ("Code" in data && data.Code === "InternalServerError") {
          console.error("Server error:", data.Message);
        } else {
          setListingData(data as ListingData);
        }
        const listing = data as ListingData;

        // Check if the retrieved data is a valid ListingData
        if ("deadline" in data) {
          // Check if the deadline is a valid date
          const deadline = new Date(listing.deadline);
          if (!isNaN(deadline.getTime())) {
            const now = new Date();
            const estNow = new Date(
              now.toLocaleString("en-US", { timeZone: "America/New_York" })
            );

            if (estNow > deadline) {
              router.push("/error");
              return;
            }
          } else {
            router.push("/error");
            return;
          }
        }

        // Check if listing is visible
        if (!listing.is_visible) {
          router.push("/error");
          return;
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        router.push("/error");
      });
  }, [params.id, router]);

  if (isLoading) return <Loader />;

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={listingData.title}
        questions={listingData.questions}
        listingId={listingData.id}
        includeEventsAttended={listingData.include_events_attended}
        isPreview={false}
      />
    </main>
  );
}
