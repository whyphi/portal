"use client"
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";



export default function Listing({ params }: { params: { listingId: string } }) {
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`)
      .then((response) => response.json())
      .then((data: [Applicant]) => {
        setApplicantData(data)
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));


  }, []);

  if (isLoading) return (<Loader />)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{applicantData.length} Applicants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {applicantData.map((applicant, index) => (
          <div key={index} className="col-span-1">
            <ApplicantCard
              listingId={params.listingId}
              applicant={applicant}
            />
          </div>
        ))}
      </div>
    </div>


  )
}
