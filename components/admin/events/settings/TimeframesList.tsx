"use client"

import React, { useState } from 'react';
import Link from 'next/link'
import { Card, Badge, Dropdown, Modal, Button } from "flowbite-react";
import { Timeframe } from "@/types/admin/events";
import { formatMongoDate } from "@/utils/date";
import { HiDotsVertical } from "react-icons/hi";
import { useAuth } from '@/app/contexts/AuthContext';


interface TimeframeListProps {
  timeframes: Timeframe[];
}

const TimeframesList: React.FC<TimeframeListProps> = ({ timeframes }) => {
  const { token } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Timeframe | null>(null);

  if (!timeframes || timeframes.length === 0) return <p className="mt-4 text-center">No Timeframes 😔</p>;

  return (
    <>
      <Card className="max-w mt-4">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {timeframes.map((timeframe) => (
              <li key={timeframe._id} className="py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-4 cursor-pointer">
                <div className="flex-1">
                  <Link href={`/admin/events/settings/${timeframe._id}`}>
                    <a className="text-base font-medium text-gray-900 dark:text-white">{timeframe.name}</a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatMongoDate(timeframe.dateCreated)}</p>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card >
    </>
  );
};


export default TimeframesList;





