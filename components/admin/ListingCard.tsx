"use client";
import { Dropdown, Badge } from 'flowbite-react';
import Link from "next/link";
import { selectedApplicantIdKey } from "@/utils/globals";
import { HiOutlineCog } from "react-icons/hi";
import Timestamp from "react-timestamp";
import { AdminTextStyles } from "@/styles/TextStyles";

interface ListingCardProps {
  listingId: string;
  title: string;
  active: boolean;
  isEncrypted: boolean;
  dateCreated: string;
  deadline: string;
}

const INDICATOR_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ENCRYPTED: "Encrypted"
};

export default function ListingCard({ listingId, title, active, isEncrypted, deadline, dateCreated }: ListingCardProps) {
  let indicatorStatus;

  if (isEncrypted) {
    indicatorStatus = INDICATOR_STATUS.ENCRYPTED;
  } else if (new Date(deadline) < new Date()) {
    indicatorStatus = INDICATOR_STATUS.INACTIVE;
  } else if (active) {
    indicatorStatus = INDICATOR_STATUS.ACTIVE;
  } else {
    indicatorStatus = INDICATOR_STATUS.INACTIVE;
  }

  const renderIndicator = (status: string) => {
    if (status === INDICATOR_STATUS.ACTIVE) {
      return (
        <div className="flex flex-row items-center">
          <span className="flex w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Active</p>
        </div>
      )
    } else if (status === INDICATOR_STATUS.ENCRYPTED) {
      return (
        <div className="flex flex-row items-center">
          <span className="flex w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Archived</p>
        </div>
      )
    }
    else {
      return (
        <div className="flex flex-row items-center">
          <span className="flex w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Inactive</p>
        </div>
      )
    }
  }

  const renderDeadline = (deadline: string) => {
    return (
      <div className="flex flex-row items-center">
        <svg className="w-2 h-2 mr-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-xs text-gray-500">
          <Timestamp date={new Date(deadline)} />
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-full flex flex-col bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow dark:bg-background-dark dark:hover:bg-gray-700 dark:border-gray-700 dark:shadow-gray-950">
      <div className="flex justify-between items-center py-2 px-6 bg-violet-100 dark:bg-violet-300 rounded-t-lg">
        {renderIndicator(indicatorStatus)}
        <div className="flex justify-between items-center">
          <div className="dropdown-container hover:cursor-pointer"> {/* Add a class to identify the dropdown */}
            <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiOutlineCog /></span>}>
              <Dropdown.Item href={`public/${listingId}`}>View Public Listing</Dropdown.Item>
              <Dropdown.Item href={`admin/listing/${listingId}/insights`}>Insights</Dropdown.Item>
              <Dropdown.Item href={`admin/settings/${listingId}`}>Settings</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
      <Link onClick={() => localStorage.removeItem(selectedApplicantIdKey)} href={`admin/listing/${listingId}`} className="py-6 px-6 flex-grow">
        <div className="flex flex-col gap-2">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <div className={`flex gap-1 ${AdminTextStyles.subtext}`}>
            Created:
            <Badge color="gray" className="inline-block">
              <Timestamp date={new Date(dateCreated)} />
            </Badge>
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