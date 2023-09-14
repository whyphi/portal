"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

interface Listing {
  Item: {
    deadline: string,
    listingId: string,
    questions: [{ question: string, context: string }],
    title: string
  },
  ResponseMetadata: object
}


export default function Listing({ params }: { params: { id: string } }) {
  const [listingData, setListingData] = useState<Listing | null>(null);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`)
      .then((response) => response.json())
      .then((data: Listing) => setListingData(data))
      .catch((error) => console.error("Error fetching listings:", error));

    console.log(listingData)
  }, []);
  return (
    <div>
      <h1> My Post: {listingData?.Item?.title}</h1>
      {listingData?.Item?.questions.map((data) => (<p>{data.question}</p>))}
    </div>)
}
