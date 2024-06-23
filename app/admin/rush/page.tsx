"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Button, Accordion, Avatar, Modal, TextInput, Label, Tooltip } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { FaRegCopy } from 'react-icons/fa';
import CreateDrawer from "@/components/admin/rush/CreateDrawer";
import { RushCategory, RushEvent } from "@/types/admin/events";
import { HiOutlinePencil, HiLink, HiOutlineTrash } from "react-icons/hi";
import { formatMongoDate } from "@/utils/date";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RushEvents() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rushCategories, setRushCategories] = useState<RushCategory[]>([]);

  const [eventName, setEventName] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");
  const [eventDeadline, setEventDeadline] = useState(new Date());

  // States managing the create event modal
  const [openCreateEventModal, setOpenCreateEventModal] = useState<boolean>(false);
  const [selectedRushCategory, setSelectedRushCategory] = useState<RushCategory | null>(null);

  // States managing the delete event modal
  const [openDeleteEventModal, setOpenDeleteEventModal] = useState<boolean>(false);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState<RushEvent | null>(null);
  const [toDeleteEventNameInput, setToDeleteEventNameInput] = useState<string>("");

  const [rushCategoriesCodeToggled, setRushCategoriesCodeToggled] = useState<Record<string, boolean>>({});

  // state to track copied status (for event.code)
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<SVGAElement>, event: RushEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(event.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };
  
  useEffect(() => {
    // Fetch all rush categories and events from the API
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Create a new object with the categories and false as their initial code toggle status
        const categoriesCodeToggled = data.reduce((acc: Record<string, boolean>, category: RushCategory) => {
          acc[category._id] = false;
          return acc;
        }, {} as Record<string, boolean>);

        // Set the categories and their initial code toggle status to state
        setRushCategories(data);
        setRushCategoriesCodeToggled(categoriesCodeToggled);

        // Stop the loading spinner
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [token]);


  function onCloseEventModal() {
    setOpenCreateEventModal(false);
    setEventName("");
  }

  function onCloseDeleteEventModal() {
    setOpenDeleteEventModal(false);
    setToDeleteEventNameInput("");
  }

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const EventRow = ({ event, index, categoryId }: { event: RushEvent, index: number, categoryId: string }) => {
    const borderTopClass = 'border-t border-gray-200 dark:border-gray-700';
    return (
      <div key={index} className={`${borderTopClass} group hover:bg-gray-100 dark:hover:bg-gray-800 py-3 sm:py-4 cursor-pointer`}>
        <div className="flex flex-row items-center w-full">
          <div className="flex-1">
            <Link href={`/admin/rush/${event.eventId}`}>
              <div className="flex items-center px-2 space-x-4">
                <div className="shrink-0">
                  <Avatar placeholderInitials={event.name[0]} rounded />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-m font-medium text-gray-900 dark:text-white">{event.name}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400 mr-1">Created: {formatMongoDate(event.dateCreated)}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400 mr-1">Deadline: {formatMongoDate(event.deadline)}</p>
                  <div className="flex gap-3 items-center">
                    <code className="truncate text-sm text-gray-500 dark:text-gray-400">{rushCategoriesCodeToggled[categoryId] ? (`Code: ${event.code}`) : "Code: •••••••"}</code>
                    {rushCategoriesCodeToggled[categoryId] && (
                      <Tooltip content={copied ? 'Copied!' : 'Copy code to clipboard'} placement="top">
                        <FaRegCopy
                          className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          onClick={(e: React.MouseEvent<SVGAElement>) => handleCopy(e, event)}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex flex-row flex-shrink-0 px-2">
            <HiOutlinePencil className="w-5 h-5 text-gray-800 transition duration-200 ease-in-out hover:text-purple-600 mr-1" />
            <HiOutlineTrash onClick={(e: React.MouseEvent<SVGAElement>) => {
              e.preventDefault();
              setSelectedEventToDelete(event);
              setOpenDeleteEventModal(true);
            }} className="w-5 h-5 text-gray-800 transition duration-200 ease-in-out hover:text-purple-600 mr-1" />
            <a
              href={process.env.NEXT_PUBLIC_API_BASE_URL === 'http://127.0.0.1:8000'
                ? `https://staging--whyphi-rush.netlify.app/checkin/${event.eventId}`
                : `https://rush.why-phi.com/checkin/${event.eventId}`
              }
              target="_blank"
              rel="noopener"
              className="w-5 h-5 group-hover:text-blue-600"
            >
              <HiLink className="w-5 h-5 text-gray-800 transition duration-200 ease-in-out hover:text-purple-600" />
            </a>
          </div>
        </div>
      </div>

    )
  }

  const handleCreateEvent = async () => {
    const eventCodeTrimmed = eventCode.trim();
    if (eventCodeTrimmed !== eventCode) {
      alert('Event code cannot contain whitespace. Please check that you are not using whitespaces in your event code.');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          categoryId: selectedRushCategory?._id, 
          name: eventName, 
          code: eventCodeTrimmed,
          deadline: eventDeadline.toISOString(),
        })
      })
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      window.location.reload();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  const handleDeleteEvent = async () => {
    console.log("hit")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${selectedEventToDelete?.eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      window.location.reload();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }



  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold dark:text-white mb-4 mt-4">Rush Events</h1>
        <div className="flex"> {/* Container for buttons */}
          <Button className="h-12 mr-2" onClick={handleDrawerOpen}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
        </div>
      </div>
      <div className="mt-4 block">
        {rushCategories.map((data: RushCategory, index) => (
          <Accordion key={index} collapseAll className="mb-2">
            <Accordion.Panel className="w-32">
              <Accordion.Title>
                {data.name}
              </Accordion.Title>
              <Accordion.Content>
                <div className="flex flex-row items-center w-full mb-4 overflow-x-auto">
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setSelectedRushCategory(data); setOpenCreateEventModal(true) }}>Create Event</Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setRushCategoriesCodeToggled({ ...rushCategoriesCodeToggled, [data._id]: !rushCategoriesCodeToggled[data._id] }); }}>{rushCategoriesCodeToggled[data._id] ? "Hide Code" : "Show Code"}</Button>
                  <Button size="xs" color="gray" className="mr-2" disabled>View Analytics</Button>
                  <Button size="xs" color="gray" className="mr-2" disabled>Export Data</Button>
                </div>
                {data.events && data.events.map((event: RushEvent, index: number) => (
                  <EventRow event={event} index={index} key={index} categoryId={data._id} />
                ))}
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        ))}
      </div>
      {/* Drawer component */}
      {isDrawerOpen && <CreateDrawer onClose={handleDrawerClose} />}

      {/* Create Event Component */}
      <Modal show={openCreateEventModal} size="md" onClose={onCloseEventModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create an Event for {selectedRushCategory?.name}</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="eventName" value="Event Name" />
                <span className="text-red-500"> *</span>
              </div>
              <TextInput id="eventName" type="text" required value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="eventCode" value="Event Code" />
                <span className="text-red-500"> *</span>
              </div>
              <TextInput id="eventCode" type="text" required value={eventCode} onChange={(e) => setEventCode(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="eventCode" value="Event Deadline" />
                <span className="text-red-500"> *</span>
              </div>
              <DatePicker
                selected={eventDeadline}
                onChange={(date: Date) => setEventDeadline(date)}
                showTimeSelect
                isClearable
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                wrapperClassName="w-full" // Add a custom class to make it full width
              />
            </div>
            <div className="w-full">
              <Button disabled={!eventName || !eventCode || !eventDeadline} onClick={handleCreateEvent}>Create Event</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openDeleteEventModal} size="md" onClose={onCloseDeleteEventModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete {selectedEventToDelete?.name}</h3>
            <p className="text-gray-500 text-sm">Are you sure you want to delete <b className="underline"><u>{selectedEventToDelete?.name}</u></b>? Deleting this event will permanently remove all data associated with it, including rushee check-in data and analytics. The deleted data is not recoverable so please proceed with caution.</p>
            <div className="w-full">
              <Label htmlFor="toDeleteEventNameInput" value="Type the event name to confirm" />
              <TextInput id="toDeleteEventNameInput" type="text" required autoFocus value={toDeleteEventNameInput} onChange={(e) => setToDeleteEventNameInput(e.target.value)} />
            </div>
            <div className="w-full flex justify-end">
              <Button color="failure" disabled={!toDeleteEventNameInput || toDeleteEventNameInput !== selectedEventToDelete?.name} onClick={handleDeleteEvent}>Delete Event</Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>
    </div >
  );
}
