"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Event, UserInEvent } from "@/types/admin/events";
import { Avatar } from 'flowbite-react';


export default function Attendance({ params }: { params: { eventId: string } }) {
  const { token } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
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
      <h1 className="text-3xl font-bold mb-6">{event?.name ?? 'Loading...'} - Attendance</h1>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Users Attended ({event?.usersAttended.length ?? 'Loading...'})</h3>
      </div>
      <hr className="border-gray-300 mt-2 mb-2 border-1" />
      {event && event.usersAttended.length > 0 ? (
        <ul className="">
          {event.usersAttended.map((user, index) => (
            <React.Fragment key={user.userId}>
              <li className="flex items-center">
                <div className="mr-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" style={{backgroundColor: `hsl(${user.name.charCodeAt(0)%360}, 80%, 90%)`}}>
                  {user.name.charAt(0)}
                </div>
                <span className="text-md">{user.name}</span>
              </li>
              {index < event.usersAttended.length - 1 ? <hr className="border-gray-300 mt-2 mb-2" /> : null}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>Looks like no one has checked in yet 😔</p>
      )}
    </div>

  );
}





