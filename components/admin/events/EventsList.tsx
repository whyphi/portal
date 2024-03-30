"use client"


import React, { useState } from 'react';
import Link from 'next/link'
import { Card, Badge, Dropdown, Modal, Button } from "flowbite-react";
import { Event } from "@/types/admin/events";
import { formatMongoDate } from "@/utils/date";
import { HiDotsVertical } from "react-icons/hi";
import { useAuth } from '@/app/contexts/AuthContext';


interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const { token } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (!events || events.length === 0) return <p className="mt-4 text-center">No Events 😔</p>;

  return (
    <Card className="max-w mt-4">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <li key={event._id} className="py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-4 cursor-pointer">
              <div className="flex-1">
                <Link href={`/admin/events/${event._id}`}>
                  <a className="text-base font-medium text-gray-900 dark:text-white">{event.name}</a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatMongoDate(event.dateCreated)}</p>
                </Link>
              </div>
              <div className="flex space-x-2">
                <Badge color="purple">Tag #1</Badge>
                <Badge color="purple">Tag #2</Badge>
              </div>
              <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiDotsVertical /></span>}>
                <Dropdown.Item
                  onClick={() => { setSelectedEvent(event); setOpenDeleteModal(true); }}
                >
                  Delete
                </Dropdown.Item>
                {/* <Dropdown.Item>Settings</Dropdown.Item> */}
              </Dropdown>
            </li>
          ))}
        </ul>
      </div>
      <Modal show={openDeleteModal} onClose={() => { setOpenDeleteModal(false); setSelectedEvent(null); }}>
        <Modal.Header>{`Are you sure you want to delete ${selectedEvent?.name}`}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              All of your data will be permanently removed from our servers forever. This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={async () => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${selectedEvent?._id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (e) {
              console.error(e);
            } finally {
              setOpenDeleteModal(false);
              setSelectedEvent(null);
            }
          }}>Delete</Button>
          <Button color="gray" onClick={() => { setOpenDeleteModal(false); setSelectedEvent(null); }}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};


export default EventsList;



