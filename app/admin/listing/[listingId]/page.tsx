"use client"
import React, { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";
import { Tabs, TabsRef, Table } from 'flowbite-react';
import { HiOutlineCollection, HiOutlineTable } from 'react-icons/hi';



export default function Listing({ params }: { params: { listingId: string } }) {
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const tabsRef = useRef<TabsRef>(null);

  // Need to investigate why tabs are changing state using refs
  // const [activeTab, setActiveTab] = useState(0);


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

  const renderApplicantCardView = () => {
    return (
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
    )
  };

  const renderApplicantTableView = () => {
    return (
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Graduation Year</Table.HeadCell>
            <Table.HeadCell>College(s)</Table.HeadCell>
            <Table.HeadCell>Major</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {applicantData.map((applicant, index) => (

              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {applicant.firstName} {applicant.lastName}
                </Table.Cell>
                <Table.Cell>{applicant.gradYear}</Table.Cell>
                <Table.Cell>
                  {/* Filter and render only true values */}
                  {Object.entries(applicant.colleges)
                    .filter(([college, value]) => value === true)
                    .map(([college]) => college)
                    .join(', ')}
                </Table.Cell>
                <Table.Cell>{applicant.major}</Table.Cell>
                <a href={`/admin/listing/${applicant.listingId}/${applicant.applicantId}`}>

                  <Table.Cell className="font-medium text-purple-600 hover:underline dark:text-purple-500">
                    View
                  </Table.Cell>
                </a>
              </Table.Row>

            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  if (isLoading) return (<Loader />)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      <Tabs.Group aria-label="Default tabs" style="default" ref={tabsRef}>
        <Tabs.Item active title="Card" icon={HiOutlineCollection}>
          {renderApplicantCardView()}
        </Tabs.Item>
        <Tabs.Item title="Table" icon={HiOutlineTable}>
          {renderApplicantTableView()}
        </Tabs.Item>
      </Tabs.Group>
    </div>


  )
}
