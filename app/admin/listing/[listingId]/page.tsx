"use client"
import React, { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";
import { useRouter } from "next/navigation";
import { HiOutlineCollection, HiOutlineTable } from 'react-icons/hi';
import { useAuth } from "@/app/contexts/AuthContext";
import ListingSidebar from "@/components/admin/ListingSidebar";
import ApplicantPage from "@/components/admin/listing/ApplicantPage";



export default function Listing({ params }: { params: { listingId: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
  const [applicantIndex, setApplicantIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const tabsRef = useRef<TabsRef>(null);

  // Need to investigate why tabs are changing state using refs
  // const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: [Applicant]) => {
        setApplicantData(data)
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, [params.listingId, token]);

  if (isLoading) return (<Loader />)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      {applicantData.length > 0 ?
        <div className="flex row-auto">
          <ListingSidebar applicantData={applicantData} setApplicantIndex={setApplicantIndex} />
          <ApplicantPage applicant={applicantData[applicantIndex]}/>
        </div>
        :
        <div>No applicants yet...</div>
      }
    </div>


  )
}
