"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";
import { HiArrowNarrowLeft } from "react-icons/hi";

import Loader from "@/components/Loader";
import TimeframesList from "@/components/admin/events/settings/TimeframesList";

export default function TimeframeSettings() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeframes, setTimeframes] = useState<Timeframe[]>([]);


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

  return (

    <div className="space-y-6">
      <Link href="/admin/events" passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>
      <div className="flex flex-col justify-between">

        <h1 className="text-4xl font-bold dark:text-white mb-6 mt-4">Timeframe Settings</h1>
        <TimeframesList timeframes={timeframes} />
      </div>
    </div>
  );
}

