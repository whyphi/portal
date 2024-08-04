"use client"

import React from 'react';
import Link from 'next/link'
import { Card, Badge } from "flowbite-react";
import { Timeframe } from "@/types/admin/events";
import Timestamp from 'react-timestamp';


interface TimeframeListProps {
  timeframes: Timeframe[];
}

const TimeframesList: React.FC<TimeframeListProps> = ({ timeframes }) => {

  if (!timeframes || timeframes.length === 0) return <p className="mt-4 text-center">No Timeframes 😔</p>;

  return (
    <>
      {timeframes.map((timeframe) => (
          <Link key={timeframe._id} href={`/admin/events/settings/${timeframe._id}`}>
            <Card className={`hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer mb-3`}>
              <a className="text-base font-medium text-gray-900 dark:text-white">{timeframe.name}</a>
              <div className='flex gap-2 items-center truncate text-sm text-gray-500 dark:text-gray-400'>
                  Date created:
                  <Badge><Timestamp date={new Date(timeframe.dateCreated)} /></Badge>
                </div>
            </Card>
          </Link>
        ))}
    </>
  );
};


export default TimeframesList;





