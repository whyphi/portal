"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Button, Accordion, Avatar } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import Image from "next/image";
import CreateDrawer from "@/components/admin/rush/CreateDrawer";


export default function RushEvents() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);


  // if (isLoading) return <Loader />;

  const dummyData = [
    {
      "category": "Fall 2024",
      "events": [
        { "title": "Info Session 1", "eventDate": "Sept 1, 2024" },
        { "title": "Info Session 2", "eventDate": "Sept 8, 2024" },
        { "title": "Social Event", "eventDate": "Sept 15, 2024" },
        { "title": "Professional Panel", "eventDate": "Sept 22, 2024" },
      ]
    },
    {
      "category": "Spring 2023",
      "events": [
        { "title": "Info Session 1", "eventDate": "Jan 12, 2023" },
        { "title": "Info Session 2", "eventDate": "Jan 26, 2023" },
        { "title": "Social Event", "eventDate": "Feb 9, 2023" },
        { "title": "Professional Panel", "eventDate": "Feb 23, 2023" },
      ]
    }
  ]

  const EventRow = ({ event, index }: { event: any, index: number }) => {
    const borderTopClass = index === 0 ? '' : 'border-t border-gray-200 dark:border-gray-700';
    return (
      <div className={`${borderTopClass} group hover:bg-gray-100 dark:hover:bg-gray-800 py-3 sm:py-4 cursor-pointer`}>
        <div className="flex items-center px-2 space-x-4">
          <div className="shrink-0">
            <Avatar placeholderInitials={event.title[0]} rounded />

          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{event.eventDate}</p>
          </div>
          {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">$320</div> */}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold dark:text-white mb-4 mt-4">Rush Events</h1>
        <div className="flex"> {/* Container for buttons */}
          <Button className="h-12 mr-2" onClick={handleDrawerOpen}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
        </div>
      </div>
      <div className="mt-4 block">
        {dummyData.map((data, index) => (
          <Accordion key={index} collapseAll className="mb-2">
            <Accordion.Panel>
              <Accordion.Title>{data.category}</Accordion.Title>
              <Accordion.Content>
                {data.events.map((event: any, index: number) => (
                  <EventRow event={event} index={index} />
                ))}
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ))}
      </div>
      {/* Drawer component */}
      {isDrawerOpen && <CreateDrawer onClose={handleDrawerClose} />}

    </div>
  );
}


