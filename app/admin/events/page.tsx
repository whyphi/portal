"use client"

import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import { Button, Accordion } from "flowbite-react";
import { HiOutlineCog, HiPlus } from "react-icons/hi";
import CreateTimeframe from "@/components/admin/events/CreateTimeframe";
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";
import EventsList from "@/components/admin/events/EventsList";
import { useRouter } from "next/navigation";
import { AdminTextStyles } from "@/styles/TextStyles";

export default function Events() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeframes, setTimeframes] = useState<Timeframe[]>([]);
  const [isCreateTimeframeVisible, setIsCreateTimeframeVisible] = useState<boolean>(false);


  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timeframes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeframes(data.sort((a: { dateCreated: string }, b: { dateCreated: string }) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()))
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateButtonClick = () => {
    setIsCreateTimeframeVisible(true);
  };

  const handleCloseButtonClick = () => {
    setIsCreateTimeframeVisible(false);
    // TODO: disable re-render when X button is clicked
    if (isCreateTimeframeVisible) {
      fetchData();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className={AdminTextStyles.title}>Events</h1>
        <Button.Group>
          <Button color="gray" onClick={handleCreateButtonClick}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
          <Button color="gray" onClick={() => router.push('/admin/events/settings')}>
            <HiOutlineCog className="mr-1 h-5 w-5" />
            Settings
          </Button>
        </Button.Group>
      </div>

      {timeframes.map((timeframe, index) => 
        <Accordion key={index} collapseAll className="mb-2">
          <Accordion.Panel>
            <Accordion.Title>
              <div className="text-m font-medium text-gray-900 dark:text-white">{timeframe.name}</div>
            </Accordion.Title>
            <Accordion.Content className="dark:bg-background-dark">
              <EventsList events={timeframe.events} />
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}

      {/* Drawer component */}
      {isCreateTimeframeVisible && <CreateTimeframe timeframes={timeframes} onClose={handleCloseButtonClick} />}

    </div>
  );
}


