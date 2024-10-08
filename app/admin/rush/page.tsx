"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Button, Accordion, Avatar, Modal, TextInput, Label, Tooltip, Card, ButtonGroup, Badge } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { FaRegCopy } from 'react-icons/fa';
import CreateDrawer from "@/components/admin/rush/CreateDrawer";
import { RushCategory, RushEvent } from "@/types/admin/events";
import { HiOutlinePencil, HiLink, HiOutlineTrash } from "react-icons/hi";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import EventModal from "@/components/admin/rush/EventModal";
import Timestamp from "react-timestamp";
import { addTwoHours } from "@/utils/date";
import { TbSettings } from "react-icons/tb";
import SettingsModal from "@/components/admin/rush/SettingsModal";
import { AdminTextStyles } from "@/styles/TextStyles";
import { getRushBaseUrl } from "@/utils/getBaseURL";

export interface EventFormData {
  eventName: string,
  eventCode: string,
  eventLocation: string,
  eventDate: Date,
  eventDeadline: Date,
  eventCoverImage: string,
  eventCoverImageName: string,
  eventCoverImageVersion: string,
  eventId?: string,
}

const initialValues: EventFormData = {
  eventName: "",
  eventCode: "",
  eventLocation: "",
  eventDate: new Date(),
  eventCoverImage: "",
  eventCoverImageName: "",
  eventDeadline: addTwoHours(new Date()),
  eventCoverImageVersion: "v0",
};

export default function RushEvents() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rushCategories, setRushCategories] = useState<RushCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventFormData, setEventFormData] = useState<EventFormData>(initialValues);

  // States managing the create event modal
  const [openCreateEventModal, setOpenCreateEventModal] = useState<boolean>(false);
  const [openModifyEventModal, setOpenModifyEventModal] = useState<boolean>(false);
  const [selectedRushCategory, setSelectedRushCategory] = useState<RushCategory | null>(null);

  // States managing the delete event modal
  const [openDeleteEventModal, setOpenDeleteEventModal] = useState<boolean>(false);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState<RushEvent | null>(null);
  const [toDeleteEventNameInput, setToDeleteEventNameInput] = useState<string>("");

  // States managing the settings modal
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
  const [defaultRushCategoryId, setDefaultRushCategoryId] = useState<string>("");

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
      .then((data: RushCategory[]) => {
        // Create a new object with the categories and false as their initial code toggle status
        const categoriesCodeToggled = data.reduce((acc: Record<string, boolean>, category: RushCategory) => {
          acc[category._id] = false;
          return acc;
        }, {} as Record<string, boolean>);

        // Set the categories and their initial code toggle status to state
        setRushCategories(data);
        setRushCategoriesCodeToggled(categoriesCodeToggled);

        // set defaultRushCategoryId
        const defaultRushCategory = data.find((category) => category.defaultRushCategory);
        setDefaultRushCategoryId(defaultRushCategory?._id ?? "")

        // Stop the loading spinner
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [token]);

  function onCloseCreateEventModal() {
    setOpenCreateEventModal(false);
    setEventFormData(initialValues);
  }

  function onCloseModifyEventModal() {
    setOpenModifyEventModal(false);
    setEventFormData(initialValues);
  }

  function onCloseDeleteEventModal() {
    setOpenDeleteEventModal(false);
    setToDeleteEventNameInput("");
  }

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const EventRow = ({ event, index, categoryId }: { event: RushEvent, index: number, categoryId: string }) => {
    return (
      <Card className={`mb-3 ${AdminTextStyles.card}`} key={index}>
        <Link href={`/admin/rush/${categoryId}/${event._id}`}>
          <div className="flex flex-col gap-5 md:flex-row lg:flex-row items-center w-full">
            <div className="flex-1">
                <div className="flex items-center px-2 space-x-4">
                  <div className="shrink-0">
                    <Avatar color="light" bordered placeholderInitials={event.name[0]} rounded />
                  </div>
                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="truncate text-m font-medium text-gray-900 dark:text-white">{event.name}</p>
                    <p className="flex gap-2 truncate text-sm text-gray-500 dark:text-gray-400 mr-1">
                      Event Date:
                      <Badge color="indigo">
                        <Timestamp date={new Date(event.date)} />
                      </Badge>
                    </p>
                    <p className="flex gap-2 truncate text-sm text-gray-500 dark:text-gray-400 mr-1">
                      Deadline:
                      <Badge color="purple">
                        <Timestamp date={new Date(event.deadline)} />
                      </Badge>
                    </p>
                    <p className="flex gap-2 truncate text-sm text-gray-500 dark:text-gray-400 mr-1">
                      Location:
                      <Badge color="green">
                        {event.location}
                      </Badge>
                    </p>
                    <div className="flex gap-3 items-center">
                      <code className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {rushCategoriesCodeToggled[categoryId] ? (`Code: ${event.code}`) : "Code: •••••••"}
                      </code>
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
            </div>
            <div className="flex flex-row items-center px-2">
              <HiOutlinePencil
                className="w-5 h-5 text-gray-800 dark:text-gray-400 transition duration-200 ease-in-out hover:w-8 hover:h-8 hover:text-purple-600 dark:hover:text-purple-500 mr-1"
                onClick={(e: React.MouseEvent<SVGAElement>) => {
                  e.preventDefault();
                  setEventFormData({
                    eventName: event.name,
                    eventCode: event.code,
                    eventLocation: event.location,
                    eventDate: new Date(event.date),
                    eventDeadline: new Date(event.deadline),
                    eventCoverImage: event.eventCoverImage,
                    eventCoverImageName: event.eventCoverImageName,
                    eventCoverImageVersion: event.eventCoverImageVersion,
                    eventId: event._id,
                  });
                  setOpenModifyEventModal(true);
                }}
              />
              <HiOutlineTrash 
                onClick={(e: React.MouseEvent<SVGAElement>) => {
                  e.preventDefault();
                  setSelectedEventToDelete(event);
                  setOpenDeleteEventModal(true);
                }} 
                className="w-5 h-5 text-gray-800 dark:text-gray-400 transition duration-200 ease-in-out hover:w-8 hover:h-8 hover:text-purple-600 dark:hover:text-purple-500 mr-1"
              />
              <a
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                href={`${getRushBaseUrl()}/checkin/${event._id}`}
                target="_blank"
                rel="noopener"
              >
                <HiLink 
                  className="w-5 h-5 text-gray-800 dark:text-gray-400 transition duration-200 ease-in-out hover:w-8 hover:h-8 hover:text-blue-600 dark:hover:text-blue-500 mr-1" 
                />
              </a>
            </div>
          </div>
        </Link>
      </Card>
    )
  }  

  // handleRusheeEvent : by default creates a rush event
  const handleRusheeEvent = async (modifying?: boolean) => {
    const eventCodeTrimmed = eventFormData.eventCode.trim();
    if (eventCodeTrimmed !== eventFormData.eventCode) {
      alert('Event code cannot contain whitespace. Please check that you are not using whitespaces in your event code.');
      return;
    }
    // ensure buttons cannot be clicked twice while API is submitting
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush`, {
        method: `${modifying ? 'PATCH' : 'POST'}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: selectedRushCategory?._id,
          name: eventFormData.eventName,
          code: eventCodeTrimmed,
          location: eventFormData.eventLocation,
          date: eventFormData.eventDate.toISOString(),
          deadline: eventFormData.eventDeadline.toISOString(),
          eventCoverImage : eventFormData.eventCoverImage,
          eventCoverImageName : eventFormData.eventCoverImageName,
          eventCoverImageVersion: eventFormData.eventCoverImageVersion,
          ...(modifying && { _id: eventFormData.eventId })
        })
      })
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      window.location.reload();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteEvent = async () => {
    console.log("hit")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${selectedEventToDelete?._id}`, {
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

  // handleRusheeEvent : by default creates a rush event
  const handleUpdateSettings = async (defaultRushCategoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defaultRushCategoryId: defaultRushCategoryId
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

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center">
        <h1 className={AdminTextStyles.title}>Rush Events</h1>
        <Button.Group>
          <Button color="gray" onClick={handleDrawerOpen}>
            <HiPlus className="mr-1 h-5 w-5" />
            Create
          </Button>
          <Button color="gray" onClick={() => setOpenSettingsModal(true)}>
            <TbSettings className="mr-1 h-5 w-5" />
            Settings
          </Button>
        </Button.Group>
      </div>
      <div className="mt-4 block">
        {rushCategories.map((data: RushCategory, index) => (
          <Accordion key={index} collapseAll className="mb-2">
            <Accordion.Panel>
              <Accordion.Title>
                <div className="flex flex-row items-center gap-3">
                  <div className="text-m font-medium text-gray-900 dark:text-white">{data.name}</div>
                  {data.defaultRushCategory && <Badge color="teal">default</Badge>}
                </div>
              </Accordion.Title>
              <Accordion.Content className="dark:bg-background-dark">
                <div className="flex flex-row items-center w-full mb-4 overflow-x-auto">
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setSelectedRushCategory(data); setOpenCreateEventModal(true) }}>Create Event</Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setRushCategoriesCodeToggled({ ...rushCategoriesCodeToggled, [data._id]: !rushCategoriesCodeToggled[data._id] }); }}>
                    {rushCategoriesCodeToggled[data._id] ? "Hide Code" : "Show Code"}
                  </Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => window.open(`/admin/rush/${data._id}/analytics`, '_blank', 'noopener,noreferrer')}>
                    View Analytics
                  </Button>
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

      {/* Custom Create/Modify Event Component Modal */}
      <EventModal
        showModal={openCreateEventModal}
        selectedRushCategory={selectedRushCategory}
        eventFormData={eventFormData}
        isSubmitting={isSubmitting}
        setEventFormData={setEventFormData}
        onClose={onCloseCreateEventModal}
        onSubmit={() => handleRusheeEvent()}
      />

      <EventModal
        showModal={openModifyEventModal}
        selectedRushCategory={selectedRushCategory}
        eventFormData={eventFormData}
        isSubmitting={isSubmitting}
        setEventFormData={setEventFormData}
        onClose={onCloseModifyEventModal}
        onSubmit={() => handleRusheeEvent(true)}
        modifyingEvent={openModifyEventModal}
      />

      {/* Custom Settings Component Modal */}
      <SettingsModal
        showModal={openSettingsModal}
        defaultRushCategoryId={defaultRushCategoryId}
        rushCategories={rushCategories}
        onClose={() => setOpenSettingsModal(false)}
        onSubmit={(defaultRushCategoryId) => handleUpdateSettings(defaultRushCategoryId)}
      />

      {/* Custom Delete Event Component Modal */}
      <Modal show={openDeleteEventModal} size="md" onClose={onCloseDeleteEventModal} popup>
        <Modal.Header className="dark:bg-background-dark" />
        <Modal.Body className="dark:bg-background-dark">
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