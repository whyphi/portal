"use client"
import { useState, useEffect } from "react";
import { Applicant } from "@/types/applicant";
import { Tabs } from 'flowbite-react';
import { HiMenuAlt1, HiDocumentText, HiUserCircle } from 'react-icons/hi';
import ResponseCard from "@/components/admin/listing/ResponseCard";


export default function ApplicantPage({ params }: { params: { applicantId: string } }) {
  const [applicantData, setApplicantData] = useState<null | Applicant>(null);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicant/${params.applicantId}`)
      .then((response) => response.json())
      .then((data: Applicant) => {
        setApplicantData(data)
        console.log(data)
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, []);

  const renderProfile = () => {
    return (
      <div className="text-2xl font-bold dark:text-white mb-6 mt-4">
        <h1>{`${applicantData?.firstName} ${applicantData?.lastName}`}</h1>
        {applicantData?.preferredName !== "" && (<h3>{applicantData?.preferredName}</h3>)}
      </div>
    )
  }

  const renderResponses = () => {
    return (
      applicantData?.responses.length === 0 ? (
        <p>None</p>
      ) : (
        <div>
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
  }

  return (
    <div>
      <Tabs.Group
        className=""
        aria-label="Tabs with underline"
        style="underline"
      >
        <Tabs.Item
          // className="text-purple-600 focus:ring-purple-300"
          active
          icon={HiUserCircle}
          title="Profile"
        >
          {renderProfile()}
        </Tabs.Item>

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
          <p>
            This is
            <span className="font-medium text-gray-800 dark:text-white">
              Contacts tab's associated content
            </span>
            .
            Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
            control the content visibility and styling.
          </p>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  )
}