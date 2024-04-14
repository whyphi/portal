"use client";
import { useState, useEffect } from "react";
import { Applicant, EventsAttended } from "@/types/applicant";
import { Badge, Tabs, Table } from 'flowbite-react';
import { HiMenuAlt1, HiDocumentText, HiUserGroup } from 'react-icons/hi';
import ResponseCard from "@/components/admin/listing/ResponseCard";
import ApplicantInfoCard from "@/components/admin/listing/ApplicantInfoCard";
import ApplicantPDFViewer from "@/components/admin/listing/ApplicantPDFViewer";
import Loader from "@/components/Loader";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ApplicantPage({ params }: { params: { applicantId: string } }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicantData, setApplicantData] = useState<null | Applicant>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicant/${params.applicantId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Applicant) => {
        setApplicantData(data);
        setIsLoading(false)
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, [params.applicantId, token]);


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

  const renderEventsAttended = (eventsAttended: EventsAttended) => {
    const eventNames = Object.keys(eventsAttended).sort();

    return (
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Event Name</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {eventNames.map((eventName) => (
              <Table.Row key={eventName} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {eventName}
                </Table.Cell>
                <Table.Cell className="flex">
                  {
                    eventsAttended[eventName] ?
                      (<Badge className="" color="success">Attended</Badge>) :
                      (<Badge color="failure">Not Attended</Badge>)
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  if (isLoading) return <Loader />


  return (
    <div className="flex flex-wrap">
      {/* Left component (ApplicantInfoCard) */}
      <div className="w-full lg:pr-6 lg:w-1/3 overflow-auto lg:sticky top-0 lg:h-screen">
        {applicantData && <ApplicantInfoCard applicant={applicantData} />}
      </div>

      {/* Right component (Tabs and content) */}
      <div className="w-full lg:w-2/3 overflow-auto lg:pl-6">
        <Tabs
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
            {applicantData && applicantData.resume ? (
              <ApplicantPDFViewer resumeLink={applicantData.resume} />
            ) : (
              <p>No resume available.</p>
            )}
          </Tabs.Item>
          {applicantData?.events ? (<Tabs.Item
            icon={HiUserGroup}
            title="Events Attended"
          >
            {renderEventsAttended(applicantData.events)}
          </Tabs.Item>) : ("")}

        </Tabs>
      </div>
    </div>
  );
}
