"use client"

import Link from "next/link";
import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";
import { HiArrowNarrowLeft, HiCheckCircle, HiOutlineUserGroup, HiOutlineTable } from "react-icons/hi";

import Loader from "@/components/Loader";
import { AdminTextStyles, DimmedAdminTextStyles } from "@/styles/TextStyles";

export default function Event({ params }: { params: { eventId: string } }) {
  const { token } = useAuth();
  const [event, setEvent] = React.useState<Timeframe | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${params.eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setEvent(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !event) return <Loader />;

  return (
    <div className="space-y-6">
      <Link href="/admin/events" passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>

      <div>
        <h1 className={AdminTextStyles.subtitle}>{event.name}</h1>
        <p className={`mt-2 ${DimmedAdminTextStyles.default}`}>ID: {event._id}</p>
      </div>
      <div className="w-full max-w p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
          Features
        </h5>
        <ul className="my-4 space-y-3">
          <li>
            <a
              href={`/admin/events/${event._id}/checkin?eventId=${event._id}&eventName=${encodeURIComponent(event.name)}`}
              className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <HiCheckCircle className="w-4 h-4" />
              <span className="flex-1 ms-3 whitespace-nowrap">Brother Checkin</span>
            </a>
          </li>
          <li>
            <a href={`/admin/events/${event._id}/attendance`} className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <HiOutlineUserGroup className="w-4 h-4" />
              <span className="flex-1 ms-3 whitespace-nowrap">View Attendance</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 text-base font-bold text-gray-500 rounded-lg group opacity-50 pointer-events-none dark:text-gray-400">
              {/* <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"> */}
              <HiOutlineTable className="w-4 h-4" />
              <span className="flex-1 ms-3 whitespace-nowrap">Export Data</span>
            </a>
          </li>
        </ul>
        <div>
          <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
            <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Want more features? Contact PCT Tech Team!</a>
        </div>
      </div>
    </div>
  );
}

