"use client"

import React, { useState, useEffect } from 'react';
import { HiOutlineUserGroup } from "react-icons/hi";
import { Label, TextInput, Button } from 'flowbite-react';

interface CreateTimeframeProps {
  onClose: () => void; // Prop for close button click handler
}

const CreateTimeframe: React.FC<CreateTimeframeProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [translateX, setTranslateX] = useState<string>('0');

  useEffect(() => {
    setTranslateX(isOpen ? '0' : '100%'); // Set initial translateX value
  }, [isOpen]);

  const handleCloseButtonClick = () => {
    setIsOpen(false);
    setTimeout(onClose, 200); // Call onClose after transition duration (300ms)
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
            key="graduationYearInput"
            required
            id="graduationYear"
            type="text"
            value={""}
            onChange={() => console.log("lol")}
          />
        </div>
        <Button
          className="w-full"
          color="purple"
        // onClick={nextStep}
        // disabled={userInfo.college === "" || userInfo.graduationYear === ""}
        >Create</Button>
      </div>
    </div>
  );
};

export default CreateTimeframe;
