"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToggleSwitch, Dropdown } from 'flowbite-react';
import Link from "next/link";
import { selectedApplicantIdKey } from "@/utils/globals";
import { HiOutlineCog } from "react-icons/hi";

interface ListingCardProps {
  listingId: string;
  title: string;
  active: boolean;
  dateCreated: string;
  deadline: string;
  applicantCount: number;
}

export default function ListingCard({ listingId, title, active, deadline, dateCreated, applicantCount }: ListingCardProps) {
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

  const renderDateCreatedBadge = (dateCreated: string) => {
    // Parse the input date string
    const createdDate = new Date(dateCreated);

    // Check if the date is valid
    if (isNaN(createdDate.getTime())) {
      return null; // Return null or handle the invalid date as needed
    }

    // Get the year, month, and day components
    const year = createdDate.getFullYear();
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');
    const day = String(createdDate.getDate()).padStart(2, '0');

    // Format the date as "yyyy-mm-dd"
    const formattedDate = `${year}. ${month}. ${day}`;

    return (
      <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
        Created: {formattedDate}
      </span>
    );
  };

  const renderDeadline = (deadline: string) => {
    // Parse the input deadline string
    const deadlineDate = new Date(deadline);

    // Check if the date is valid
    if (isNaN(deadlineDate.getTime())) {
      return null; // Return null or handle the invalid date as needed
    }

    // Get the year, month, day, hours, minutes, and seconds components
    const year = deadlineDate.getFullYear();
    const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
    const day = String(deadlineDate.getDate()).padStart(2, '0');
    const hours = String(deadlineDate.getHours()).padStart(2, '0');
    const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
    const seconds = String(deadlineDate.getSeconds()).padStart(2, '0');

    // Format the date as "yyyy. dd. mm, hh:mm:ss"
    const formattedDeadline = `${year}. ${month}. ${day}, ${hours}:${minutes}:${seconds}`;

    return (
      <div className="flex flex-row items-center">
        <svg className="w-2 h-2 mr-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-xs text-gray-500">
          {formattedDeadline}
        </p>
      </div>
    );
  };


  const handleListingCardClick = (event: React.MouseEvent) => {
    const isDropdownClick = (event.target as HTMLElement).closest('.dropdown-container');

    // Navigate to the listingId URL only if it's not a dropdown click
    if (!isDropdownClick) {
      router.push(`/admin/listing/${listingId}`);
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
    <div className="min-h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center py-2 px-6 bg-violet-100 dark:bg-violet-200 rounded-t-lg">
        {renderIndicator(isActive)}
        <div className="flex justify-between items-center">
          <div className="dropdown-container cursor-pointer"> {/* Add a class to identify the dropdown */}
            <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiOutlineCog /></span>}>
              <Dropdown.Item href={`public/${listingId}`}>View Public Listing</Dropdown.Item>
              <Dropdown.Item href={`admin/listing/${listingId}/insights`}>Insights</Dropdown.Item>
              <Dropdown.Item href={`admin/settings/${listingId}`}>Settings</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
      <Link onClick={() => localStorage.removeItem(selectedApplicantIdKey)} href={`admin/listing/${listingId}`} className="py-6 px-6 flex-grow">
        <div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <div className="mt-1">
            {renderDateCreatedBadge(dateCreated)}
          </div>
        </div>
        <div className="mt-auto">
          <hr className="h-px mb-2 mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
          {renderDeadline(deadline)}
        </div>
      </Link>
    </div >
  );
}