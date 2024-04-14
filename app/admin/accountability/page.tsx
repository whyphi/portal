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

  const ProgressBar = ({ currentPoints, required }: { currentPoints: number; required: number }) => {
    return (
      <Progress
        progress={currentPoints / required * 100}
        color={currentPoints >= required ? "green" : "purple"} // Change color to green if points are 100 or more
      />
    )
  }

  const BucketMetBadge = ({ bucketMet }: { bucketMet: boolean }) => (
    <div className="flex flex-row items-center mt-3">
      <Badge color={bucketMet ? 'success' : 'failure'}>{bucketMet ? 'YES' : 'NO'}</Badge>
    </div>
  )


  const [colDefs, setColDefs] = useState([
    { field: "name", flex: 2, filter: true },
    { field: "currentPoints", flex: 1, },
    {
      field: "progress", flex: 4, cellRenderer: (params: any) => (
        <div className="mt-4">
          <ProgressBar currentPoints={params.data.currentPoints} required={params.data.required} />
        </div>
      )
    },
    { field: "Chapter Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.chapterBucketMet} /> },
    { field: "Rush Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.rushBucketMet} /> },
    { field: "Fundraising Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.fundraisingBucketMet} /> },
    { field: "Events Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.eventsBucketMet} /> },
    { field: "Teams Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.teamsBucketMet} /> },
    { field: "Variable Bucket", flex: 1, cellRenderer: (params: any) => <BucketMetBadge bucketMet={params.data.variableBucketMet} /> },
    // { field: "electric" }
  ]);


  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accountability?page=0&page_size=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAccountability(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>Accountability Tracker</h1>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: "80vh" }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          rowData={accountability}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 25, 50, 100]}
        />
      </div>
    </div>
  );
}

