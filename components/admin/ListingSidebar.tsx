"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Dropdown, Avatar } from "flowbite-react";
import { HiOutlineQrcode } from "react-icons/hi";
import { Tabs, TabsRef, Table } from 'flowbite-react';
import { Applicant } from "@/types/applicant"

interface ListingSidebarProps {
  applicantData: Applicant[];
  setApplicantIndex: React.Dispatch<React.SetStateAction<number>>;
}
export default function ListingSidebar({ applicantData, setApplicantIndex }: ListingSidebarProps) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderApplicantTableView = () => {
    return (
      <div className="overflow-y-auto h-full w-60" style={{ maxHeight: "calc(100vh - 100px)" }}>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {applicantData.map((applicant, index) => (

              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                onClick={(event) => {
                  setApplicantIndex(index)
                  // if (event.metaKey) {
                  //   // Cmd + click (on macOS) or Ctrl + click (on Windows/Linux)
                  //   window.open(`/admin/listing/${applicant.listingId}/${applicant.applicantId}`, '_blank');
                  // } else {
                  //   // Regular click
                  //   router.push(`/admin/listing/${applicant.listingId}/${applicant.applicantId}`);
                  // }
                }}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {applicant.firstName} {applicant.lastName}
                </Table.Cell>
              </Table.Row>

            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  return (
    <>
      {renderApplicantTableView()}
    </>
  );
}
