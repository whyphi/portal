"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Button, Accordion, Avatar, Modal, TextInput, Label } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import Image from "next/image";
import CreateDrawer from "@/components/admin/rush/CreateDrawer";
import { RushCategory, RushEvent } from "@/types/admin/events";
import { HiLink } from "react-icons/hi";
import { formatMongoDate } from "@/utils/date";
import Link from "next/link";


export default function RushEvents() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rushCategories, setRushCategories] = useState<RushCategory[]>([]);

  const [eventName, setEventName] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");
  const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
  const [selectedRushCategory, setSelectedRushCategory] = useState<RushCategory | null>(null);

  const [rushCategoriesCodeToggled, setRushCategoriesCodeToggled] = useState<Record<string, boolean>>({});

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
    setEventName('');
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
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{event.name}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400 mr-1">{formatMongoDate(event.dateCreated)}</p>
                  <code className="truncate text-sm text-gray-500 dark:text-gray-400">{rushCategoriesCodeToggled[categoryId] ? (`Code: ${event.code}`) : "Code: ••••••••••••••••"}</code>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex-shrink-0 px-2">
            <a
              href={`https://rush.why-phi.com/checkin/${event.eventId}`}
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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId: selectedRushCategory?._id, name: eventName, code: eventCode })
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
  console.log(rushCategoriesCodeToggled)
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
                <div className="flex flex-row items-center w-full mb-4">
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setSelectedRushCategory(data); setOpenCreateEventModal(true) }}>Create Event</Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setRushCategoriesCodeToggled({ ...rushCategoriesCodeToggled, [data._id]: !rushCategoriesCodeToggled[data._id] }); }}>{rushCategoriesCodeToggled[data._id] ? "Hide Code" : "Show Code"}</Button>
                  {/* <Button size="xs" color="gray" className="mr-2 w-16">Delete</Button> */}
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
              </div>
              <TextInput id="eventName" type="text" required value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="eventCode" value="Event Code" />
              </div>
              <TextInput id="eventCode" type="text" required value={eventCode} onChange={(e) => setEventCode(e.target.value)} />
            </div>
            <div className="w-full">
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div >
  );
}
