"use client"

import React, { useState, useEffect } from 'react';
import { HiOutlineUserGroup } from "react-icons/hi";
import { Label, TextInput, Button, Select } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";

interface CreateTimeframeProps {
  timeframes: Timeframe[];
  onClose: () => void; // Prop for close button click handler
}

const CreateTimeframe: React.FC<CreateTimeframeProps> = ({ onClose, timeframes }) => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [translateX, setTranslateX] = useState<string>('0');
  const [timeframeName, setTimeframeName] = useState<string>("");

  const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState<number>(0);
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    setTranslateX(isOpen ? '0' : '100%'); // Set initial translateX value
  }, [isOpen]);

  const handleCloseButtonClick = () => {
    setIsOpen(false);
    setTimeout(onClose, 200); // Call onClose after transition duration (300ms)
  };

  const handleInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeframeName(e.target.value)
  };

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value)
  };

  const handleCreateTimeframe = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timeframes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: timeframeName })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      onClose();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  };

  const handleCreateEvent = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/timeframes/${timeframes[selectedTimeframeIndex]._id}/events`;
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: eventName })
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      style={{ transform: `translateX(${translateX})` }}
      className="fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 outline outline-gray-200 shadow-lg"
    >
      <button
        type="button"
        onClick={handleCloseButtonClick}
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span className="sr-only">Close menu</span>
      </button>
      <div>
        <h5 id="drawer-label" className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          <HiOutlineUserGroup className="w-3.5 h-3.5 me-2.5" />NEW TIMEFRAME
        </h5>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="graduationYear" value="Name" />
          </div>
          <TextInput
            key="timeframeName"
            required
            id="timeframeName"
            type="text"
            value={timeframeName}
            onChange={handleInputchange}
          />
        </div>
        <Button
          className="w-full"
          color="purple"
          onClick={handleCreateTimeframe}
          disabled={timeframeName === ""}
        >Create Timeframe</Button>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <div>
        <h5 id="drawer-label" className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          NEW EVENT
        </h5>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="graduationYear" value="Choose Timeframe" />
          </div>
          <Select id="timeframe" required value={selectedTimeframeIndex} onChange={(e) => setSelectedTimeframeIndex(parseInt(e.target.value))}>
            {timeframes.map((timeframe, index) => (
              <option key={index} value={index}>{timeframe.name}</option>
            ))}
          </Select>
          <div className="mt-6 mb-2 block">
            <Label htmlFor="graduationYear" value="Event Name" />
          </div>
          <TextInput
            key="eventName"
            required
            id="eventName"
            type="text"
            value={eventName}
            onChange={handleEventNameChange}
          />
        </div>
        <Button
          className="w-full"
          color="purple"
          onClick={handleCreateEvent}
          disabled={eventName === ""}
        >Create Event</Button>
      </div>
    </div>
  );
};

export default CreateTimeframe;


