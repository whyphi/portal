"use client"

import React, { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import Loader from "@/components/Loader";
import { Button, Select, Label } from "flowbite-react";
import { HiOutlineCog, HiPlus } from "react-icons/hi";
import { useRouter } from "next/navigation";
import CreateTimeframe from "@/components/admin/events/CreateTimeframe";
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";

export default function Events() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeframes, setTimeframes] = useState<Timeframe[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
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
        setSelectedTimeframe(data[0].name);
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
        <h1 className="text-4xl font-bold dark:text-white mb-6 mt-4">Events</h1>
        <div className="flex"> {/* Container for buttons */}
          <Button className="h-12 mr-2" onClick={handleCreateButtonClick}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
          <Button className="">
            <HiOutlineCog className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="mb-2 block">
        <Label htmlFor="timeframe" value="Select your timeframe" />
      </div>
      <Select id="timeframe" required value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)}>
        {timeframes.map((timeframe) => (
          <option key={timeframe.name} value={timeframe.name}>{timeframe.name}</option>
        ))}
      </Select>

      {/* Drawer component */}
      {isCreateTimeframeVisible && <CreateTimeframe timeframes={timeframes} onClose={handleCloseButtonClick} />}

    </div>
  );
}
