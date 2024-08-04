"use client"


import React, { useState } from 'react';
import Link from 'next/link'
import { Card, Badge, Modal, Button, Popover, ListGroup } from "flowbite-react";
import { Event } from "@/types/admin/events";
import { HiDotsVertical, HiOutlineTrash } from "react-icons/hi";
import { useAuth } from '@/app/contexts/AuthContext';
import Timestamp from 'react-timestamp';


interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const { token } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleOptionsClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  if (!events || events.length === 0) return <p className="mt-4 text-center">No Events 😔</p>;

  return (
    <div>
      {events.map((event) => (
        <Link className='w-full' href={`/admin/events/${event._id}`} key={event._id}>
          <Card className={`hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer mb-3`}>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <a className="text-base font-medium text-gray-900 dark:text-white">{event.name}</a>
                <Badge>
                  <Timestamp date={new Date(event.dateCreated)} />
                </Badge>
              </div>
              <div className='flex gap-2'>
                {event.tags?.map((tag) => (
                  <Badge key={tag} color="purple">
                    {tag}
                  </Badge>
                ))}
                <Popover 
                  trigger="click"
                  placement="bottom-end"
                  arrow={false}
                  content={
                    <ListGroup className="w-48">
                      <div
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          handleOptionsClick(e); 
                          setSelectedEvent(event); 
                          setOpenDeleteModal(true); 
                        }}
                      >
                        <ListGroup.Item active icon={HiOutlineTrash} >Delete</ListGroup.Item>
                      </div>
                      {/* TODO: add settings <div
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          handleOptionsClick(e); 
                        }}
                      >
                        <ListGroup.Item>Settings</ListGroup.Item>
                      </div> */}
                    </ListGroup>
                  }
                  >
                  <button onClick={handleOptionsClick} className="focus:outline-none">
                    <HiDotsVertical />
                  </button>
                </Popover>
              </div>
            </div>
          </Card>
        </Link>
      ))}

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
              window.location.reload();

            }
          }}>Delete</Button>
          <Button color="gray" onClick={() => { setOpenDeleteModal(false); setSelectedEvent(null); }}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


export default EventsList;



