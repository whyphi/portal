"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToggleSwitch, Dropdown } from 'flowbite-react';
import Link from "next/link";
import { selectedApplicantIdKey } from "@/utils/globals";

interface InterviewListingCardProps {
    listingId: string;
    title: string;
    semester: string; 
    active: boolean;
    questions: string[];
    dateCreated: string;
}

export default function InterviewListingCard({ listingId, title, semester, active, questions, dateCreated }: InterviewListingCardProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(active);

  const renderIndicator = (active: boolean) => {
    if (active) {
      return (
        <div className="flex flex-row items-center">
          <span className="flex w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Active</p>
        </div>
      )
    } else {
      return (
        <div className="flex flex-row items-center">
          <span className="flex w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Inactive</p>
        </div>
      )
    }
  }

  const renderSemester = (semester: string) => { 
    return (
      <span className="text-sm text-gray-600 dark:text-gray-300">{semester}</span>
    )
  }

  const handleListingCardClick = (event: React.MouseEvent) => {
    const isDropdownClick = (event.target as HTMLElement).closest('.dropdown-container');

    // Navigate to the listingId URL only if it's not a dropdown click
    if (!isDropdownClick) {
      router.push(`/admin/interview/${listingId}`); // TO-DO: ensure this URL works
    }
  };

  const handleToggleSwitchChange = async (isChecked: boolean) => {
    

    try {
      // Update the local state
      setIsActive(isChecked);

      // Make an API request to update the visibility
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${listingId}/toggle/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('API request failed:', response.statusText);
        // Roll back the state change if needed
        setIsActive(!isChecked);
      }
    } catch (error) {
      console.error('An error occurred while making the API request:', error);
      setIsActive(!isChecked);
    }
  };

  const handleToggleSwitchClick = (event: React.MouseEvent) => {
    // Prevent the click event from propagating to the parent div (card)
    event.stopPropagation();
    handleToggleSwitchChange(!isActive);
  };

  const renderSettingsIcon = () => {
    return (
      <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M19 11V9a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L12 2.757V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L2.929 4.343a1 1 0 0 0 0 1.414l.536.536L2.757 8H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535L8 17.243V18a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H18a1 1 0 0 0 1-1Z" />
          <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </g>
      </svg>
    )
  }


  return (
    // TO-DO: turn this into a table too; doesn't really make sense to keep it as a card tbh ?
    <div className="min-h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center py-2 px-6 bg-violet-100 rounded-t-lg">
        {renderIndicator(isActive)}
        <div className="flex justify-between items-center">
          <div className="dropdown-container cursor-pointer"> {/* Add a class to identify the dropdown */}
            <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span>{renderSettingsIcon()}</span>}>
              <Dropdown.Item href={`public/${listingId}`}>View Public Listing</Dropdown.Item>
              <Dropdown.Item href={`admin/listing/${listingId}/insights`}>Insights</Dropdown.Item>
              <Dropdown.Item href={`admin/settings/${listingId}`}>Settings</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
      <Link onClick={() => localStorage.removeItem(selectedApplicantIdKey)} href={`interviews/${listingId}`} className="py-6 px-6 flex-grow">
        <div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <div className="mt-1">
            {/* {renderDateCreatedBadge(dateCreated)} */}
          </div>
        </div>
        <div className="mt-auto">
          <hr className="h-px mb-2 mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
            {renderSemester(semester)}
        </div>
      </Link>
    </div >
  );
}