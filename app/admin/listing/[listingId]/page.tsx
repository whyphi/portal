"use client"
import React, { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { Applicant } from "@/types/applicant";
import { selectedApplicantIdKey } from "@/utils/globals";
import { Tabs, TabsRef, Table, Button, Pagination } from 'flowbite-react';
import { HiArrowLeft, HiOutlineCollection, HiOutlineTable } from 'react-icons/hi';
import { useAuth } from "@/app/contexts/AuthContext";
import { delay } from "@/utils/delay";
import ApplicantPage from "@/components/admin/listing/ApplicantPage";
import { AdminTextStyles } from "@/styles/TextStyles";

export default function Listing({ params }: { params: { listingId: string } }) {
  // authentication token (for API)
  const { token } = useAuth();
  
  // state variables
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState<number>(-1);
  const [applicantHighlighted, setApplicantHighlighted] = useState<boolean[]>([]);

  // ref variables
  const tabsRef = useRef<TabsRef>(null);
  const applicantRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        // update applicantData, highlighted applicants, and loading status
        setApplicantData(data);
        setApplicantHighlighted(Array(data.length).fill(false));
        setIsLoading(false);

        // after fetching listings -> use localStorage to check if selectedApplicant is defined
        const selectedApplicantId =localStorage.getItem(selectedApplicantIdKey);

        // check that applicant exists in localStorage
        if (selectedApplicantId) {
          // Find the index of the applicant in the applicantData array
          const applicantIndex = data.findIndex(applicant => selectedApplicantId == applicant.id);

          // Check if an applicant was found
          if (applicantIndex !== -1) {
            const applicant = data[applicantIndex];

            // Check that applicant is still valid (otherwise we go back to All Applicants screen)
            if (applicant) {
              setSelectedApplicant(applicant);
              setSelectedApplicantIndex(applicantIndex);
            }
          }
        }
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, [params.listingId, token]);

  const renderApplicantCardView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {applicantData.map((applicant, index) => (
          <div key={index} className="col-span-1" ref={(ref) => (applicantRefs.current[index] = ref)}>
            <ApplicantCard
              listingId={params.listingId}
              applicant={applicant}
              index={index}
              highlighted={applicantHighlighted[index]}
              setSelectedApplicant={setSelectedApplicant}
              setSelectedApplicantIndex={setSelectedApplicantIndex}
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
          </Table.Head>
          <Table.Body className="divide-y">
            {applicantData.map((applicant, index) => (

              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                onClick={(event) => {
                  // scroll to top of page
                  window.scrollTo({
                    top: 0,
                    // behavior: 'smooth', // change 'smooth' to 'auto' if you don't want a smooth scroll
                  });

                  // update state variables
                  setSelectedApplicant(applicant);
                  setSelectedApplicantIndex(index);

                  // push to localStorage
                  localStorage.setItem(selectedApplicantIdKey, applicant.id);
                }}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {applicant.first_name} {applicant.last_name}
                </Table.Cell>
                <Table.Cell>{applicant.grad_year}</Table.Cell>
                <Table.Cell>
                  {/* Filter and render only true values */}
                  {Object.entries(applicant.colleges)
                    .filter(([college, value]) => value === true)
                    .map(([college]) => college)
                    .join(', ')}
                </Table.Cell>
                <Table.Cell>{applicant.major}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  const viewAllApplicants = async () => {
    // grab current selectedApplicantIndex
    const index = selectedApplicantIndex;

    // update state variables
    setSelectedApplicant(null);
    setSelectedApplicantIndex(-1);

    // clear selectedApplicantId from localStorage
    localStorage.removeItem(selectedApplicantIdKey);

    // set appicantHighlighted[index] to be true for some time
    const newHighlights = [...applicantHighlighted];
    newHighlights[index] = true;
    setApplicantHighlighted(newHighlights);

    // Scroll to that index after state update (ensures scroll occurs in NEXT event-loop-cycle)
    await delay(0);
    scrollApplicantIntoView(index);
    
    // reset applicant highlights after 2 seconds
    await delay(2000);
    setApplicantHighlighted(Array(applicantHighlighted.length).fill(false))
  }

  const onPageChange = (page: number) => {
    const index = page - 1;
    if (index < 0) {
      console.error("uh oh, page index out of range", index, applicantData.length)
    }

    const applicant = applicantData[index]

    // update state variables
    setSelectedApplicant(applicant);
    setSelectedApplicantIndex(index);

    // push to localStorage
    localStorage.setItem(selectedApplicantIdKey, applicant.id);
  };

  const scrollApplicantIntoView = (index: number) => {
    const applicantRef = applicantRefs.current[index];
    if (applicantRef) {
      applicantRef.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  if (isLoading) return (<Loader />)

  return (
    <div>
      <h1 className={AdminTextStyles.subtitle}>Applicants</h1>
      {/* either render Tabs (all applicants) OR single applicant view */}
      {selectedApplicant == null
        ? 
        <Tabs aria-label="Default tabs" ref={tabsRef}>
          <Tabs.Item active title="Card" icon={HiOutlineCollection}>
            {renderApplicantCardView()}
          </Tabs.Item>
          <Tabs.Item title="Table" icon={HiOutlineTable}>
            {renderApplicantTableView()}
          </Tabs.Item>
        </Tabs>
        :
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Button color="gray" onClick={viewAllApplicants}>
                <HiArrowLeft className="mr-2"/>
                View all
              </Button>
              <Pagination
                layout="navigation"
                currentPage={selectedApplicantIndex + 1}
                totalPages={applicantData.length}
                onPageChange={onPageChange}
                previousLabel={"Previous"}
                nextLabel={"Next"}
                showIcons
              />
            </div>
            <div className="flex justify-end text-gray-500 text-sm">
              <div className="">({selectedApplicantIndex + 1} of {applicantData.length} applicants)</div>
            </div>
          </div>
          <ApplicantPage applicant={selectedApplicant}/>
        </div>
      }
      
    </div>
  )
}
