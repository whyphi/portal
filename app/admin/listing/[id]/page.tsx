"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";


export default function Listing({ params }: { params: { id: string } }) {
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.id}`)
      .then((response) => response.json())
      .then((data: [Applicant]) => {
        setApplicantData(data)
        console.log(applicantData)
      })
      .catch((error) => console.error("Error fetching listings:", error));


  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

        {applicantData.map((applicant, index) => (
          <div key={index} className="col-span-1">
            <ApplicantCard
              applicant={applicant}
            />
          </div>
        ))}

      </div>
    </div>


  )
}
