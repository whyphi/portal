"use client"
import React, { useState, useEffect } from "react";
import Form from "@/components/Form"
import Loader from "@/components/Loader";

interface Listing {
  Item: {
    deadline: string,
    listingId: string,
    questions: [] | [{ question: string, context: string }],
    title: string
  },
  ResponseMetadata: object
}


export default function Listing({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<Listing["Item"]>({
    deadline: "",
    listingId: "",
    questions: [],
    title: ""
  });

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`)
      .then((response) => response.json())
      .then((data: Listing) => {
        setListingData(data.Item);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, []);

  return (

    (isLoading ? (<Loader />) : (<main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form title={listingData && listingData.title} questions={listingData.questions} listingId={listingData && listingData.listingId} />
    </main>))


  )
}
