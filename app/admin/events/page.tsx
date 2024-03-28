"use client"

import React, { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import Loader from "@/components/Loader";
import { Button, Select, Label } from "flowbite-react";
import { HiOutlineCog, HiPlus } from "react-icons/hi";
import { useRouter } from "next/navigation";
import CreateTimeframe from "@/components/admin/events/CreateTimeframe";

export default function Events() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
  const [isCreateTimeframeVisible, setIsCreateTimeframeVisible] = useState<boolean>(false);


  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const dummyData = [
        { name: "Fall 2023", dateCreated: new Date("2024-03-22T14:31:54.916Z") },
        { name: "Spring 2024", dateCreated: new Date("2024-03-28T14:31:54.916Z") }
      ];

      // Sort dummyData by dateCreated in descending order
      dummyData.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());

      setSelectedTimeframe(dummyData[0]?.name);

      setIsLoading(false);
    }, 1000); // Simulated delay for demonstration
  }, []);

  const handleCreateButtonClick = () => {
    setIsCreateTimeframeVisible(true);
  };

  const handleCloseButtonClick = () => {
    setIsCreateTimeframeVisible(false);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold dark:text-white mb-6 mt-4">Events</h1>
        <div className="flex"> {/* Container for buttons */}
          <Button className="h-12 mr-2" onClick={handleCreateButtonClick}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create Timeframe
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
        <option value="Spring 2024">Spring 2024</option>
        <option value="Fall 2023">Fall 2023</option>
      </Select>

      {/* Drawer component */}
      {isCreateTimeframeVisible && <CreateTimeframe onClose={handleCloseButtonClick} />}

    </div>
  );
}