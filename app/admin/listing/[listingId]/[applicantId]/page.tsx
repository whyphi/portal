"use client";
import { useState, useEffect } from "react";
import { Applicant } from "@/types/applicant";
import { Tabs } from 'flowbite-react';
import { HiMenuAlt1, HiDocumentText, HiUserCircle } from 'react-icons/hi';
import ResponseCard from "@/components/admin/listing/ResponseCard";
import ApplicantInfoCard from "@/components/admin/listing/ApplicantInfoCard";
import ApplicantPDFViewer from "@/components/admin/listing/ApplicantPDFViewer";

export default function ApplicantPage({ params }: { params: { applicantId: string } }) {
  const [applicantData, setApplicantData] = useState<null | Applicant>(null);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicant/${params.applicantId}`)
      .then((response) => response.json())
      .then((data: Applicant) => {
        setApplicantData(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, []);


  const renderResponses = () => {
    return (
      applicantData?.responses.length === 0 ? (
        <p>None</p>
      ) : (
        <div className="">
          {applicantData?.responses.map((response, index) => (
            <ResponseCard
              key={index}
              question={response.question}
              answer={response.response}
            />
          ))}
        </div>
      )
    );
  };


  return (
    <div className="flex flex-wrap">
      {/* Left component (ApplicantInfoCard) */}
      <div className="w-full lg:pr-6 lg:w-1/3 overflow-auto lg:sticky top-0 lg:h-screen">
        <ApplicantInfoCard applicant={applicantData} />
      </div>

      {/* Right component (Tabs and content) */}
      <div className="w-full lg:w-2/3 overflow-auto lg:pl-6">
        <Tabs.Group
          className=""
          aria-label="Tabs with underline"
          style="underline"
        >

          <Tabs.Item
            icon={HiMenuAlt1}
            title="Responses"
          >
            {renderResponses()}
          </Tabs.Item>
          <Tabs.Item
            icon={HiDocumentText}
            title="Resume"
          >
            <ApplicantPDFViewer />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
