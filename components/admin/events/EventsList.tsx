"use client"

import React from 'react';
import { Card } from "flowbite-react";
import { Event } from "@/types/admin/events";
import { formatMongoDate } from "@/utils/date";

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {

  if (!events || events.length === 0) return <p className="mt-4 text-center">No Events 😔</p>;

  return (
    <Card className="max-w mt-4">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <li key={event._id} className="py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-gray-900 dark:text-white">{event.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatMongoDate(event.dateCreated)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default EventsList;


