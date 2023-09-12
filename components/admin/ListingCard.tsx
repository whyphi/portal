"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from 'next/link'

interface ListingCardProps {
  title: string;
  active: boolean;
  dateCreated: string;
  applicantCount: number;
}




export default function ListingCard({ title, active, dateCreated, applicantCount }: ListingCardProps) {

  const renderIndicator = (active: boolean) => {
    if (active) {
      return (
        <div className="flex flex-row items-center mb-2">
          <span className="flex w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          <p className="text-sm font-medium">Active</p>
        </div>
      )
    } else {
      return (
        <div className="flex flex-row items-center mb-2">
          <span className="flex w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          <p className="text-sm font-medium">Inactive</p>
        </div>
      )
    }
  }

  const renderDateCreatedBadge = (dateCreated: string) => {
    return (
      <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Created: {dateCreated}</span>

    )
  }

  return (

    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {renderIndicator(active)}
      <a href="#">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      </a>
      <div>
        {renderDateCreatedBadge(dateCreated)}
      </div>


      <p className="text-sm font-medium">
        Total {applicantCount}
      </p>
    </div>

  );

}