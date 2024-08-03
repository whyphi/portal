"use client"
import React, { useState, useEffect } from "react";
import { Progress, Badge } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid


export default function Accountability() {
  const { token } = useAuth();
  const [accountability, setAccountability] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const textStyles = {
    title: "text-2xl font-medium dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };


  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>Family Tree</h1>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: "80vh" }} // the grid will fill the size of the parent container
      >

      </div>
    </div>
  );
}

