"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";

export default function RushEvents() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold dark:text-white mb-6 mt-4">Rush Events</h1>
        <div className="flex"> {/* Container for buttons */}
          {/* <Button className="h-12 mr-2" onClick={handleCreateButtonClick}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
          <Button onClick={() => router.push('/admin/events/settings')} className="h-12">
            <HiOutlineCog className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}


