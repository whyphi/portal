"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { EventMemberDetails } from "@/types/admin/events";
import { Avatar } from 'flowbite-react';
import { AdminTextStyles, DimmedAdminTextStyles } from '@/styles/TextStyles';


export default function Attendance({ params }: { params: { eventId: string } }) {
  const { token } = useAuth();
  const [event, setEvent] = useState<EventMemberDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${params.eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setEvent(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-screen px-4">
      <Link href={`/admin/events/${params.eventId}`} passHref>
        <button className="mb-6 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>
      <h1 className={`mb-6 ${AdminTextStyles.subtitle}`}>{event?.name ?? 'Loading...'} - Attendance</h1>
      <div className="flex items-center justify-between mb-2">
        <h3 className={DimmedAdminTextStyles.subtext}>Users Attended ({event?.attendees.length ?? 'Loading...'})</h3>
      </div>
      <hr className="border-gray-300 mt-2 mb-2 border-1" />
      {event && event.attendees.length > 0 ? (
        <ul className="">
          {event.attendees.map((attendee, index) => (
            <React.Fragment key={attendee.user.id}>
              <li className="flex items-center">
                <div className="mr-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" style={{backgroundColor: `hsl(${attendee.user.name.charCodeAt(0)%360}, 80%, 90%)`}}>
                  {attendee.user.name.charAt(0)}
                </div>
                <span className={AdminTextStyles.default}>{attendee.user.name}</span>
              </li>
              {index < event.attendees.length - 1 ? <hr className="border-gray-300 mt-2 mb-2" /> : null}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>Looks like no one has checked in yet 😔</p>
      )}
    </div>

  );
}





