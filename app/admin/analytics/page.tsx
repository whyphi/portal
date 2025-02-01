"use client"
import React, { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import { Applicant } from "@/types/applicant";
import { Tabs, TabsRef, Table, Button, Pagination } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminTextStyles } from "@/styles/TextStyles";

export default function Analytics() {
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // // Fetch listings data from your /listings API endpoint
    // fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data: [Applicant]) => {
    //     // update applicantData, highlighted applicants, and loading status
    //     setApplicantData(data);
    //     setApplicantHighlighted(Array(data.length).fill(false));
    //     setIsLoading(false);

    //     // after fetching listings -> use localStorage to check if selectedApplicant is defined
    //     const selectedApplicantId =localStorage.getItem(selectedApplicantIdKey);

    //     // check that applicant exists in localStorage
    //     if (selectedApplicantId) {
    //       // Find the index of the applicant in the applicantData array
    //       const applicantIndex = data.findIndex(applicant => selectedApplicantId == applicant.applicantId);

    //       // Check if an applicant was found
    //       if (applicantIndex !== -1) {
    //         const applicant = data[applicantIndex];

    //         // Check that applicant is still valid (otherwise we go back to All Applicants screen)
    //         if (applicant) {
    //           setSelectedApplicant(applicant);
    //           setSelectedApplicantIndex(applicantIndex);
    //         }
    //       }
    //     }
    //   })
    //   .catch((error) => console.error("Error fetching listings:", error));
    setIsLoading(false);
  }, [token]);

  if (isLoading) return (<Loader />)

  const ACTIVE_MEMBER_COUNT = 89;

  return (
    <div>
      <h1 className={AdminTextStyles.subtitle}>Member-related Data</h1>


    </div>
  )
}
