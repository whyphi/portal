"use client"
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";



export default function test({ params }: { params: { listingId: string } }) {
  // Fetch listings data from your /listings API endpoint
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`)
    .then((response) => response.json())
    .then((data: [Applicant]) => {
      console.log(data)
    })
    .catch((error) => console.error("Error fetching applicants:", error));
  }, [])


  return (
    <div>
        "test"
    </div>


  )
}