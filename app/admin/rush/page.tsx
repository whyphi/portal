"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Button, Accordion, Avatar, Modal, TextInput, Label, Tooltip, Card, ButtonGroup, Badge } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { FaRegCopy } from 'react-icons/fa';
import CreateDrawer from "@/components/admin/rush/CreateDrawer";
import { EventTimeframeRush, EventRush } from "@/types/admin/events";
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

export interface EventRushFormData {
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

const initialValues: EventRushFormData = {
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
  const [eventTimeframesRush, setEventTimeframesRush] = useState<EventTimeframeRush[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventFormData, setEventFormData] = useState<EventRushFormData>(initialValues);

  // States managing the create event modal
  const [openCreateEventModal, setOpenCreateEventModal] = useState<boolean>(false);
  const [openModifyEventModal, setOpenModifyEventModal] = useState<boolean>(false);
  const [selectedRushTimeframe, setSelectedRushTimeframe] = useState<EventTimeframeRush | null>(null);

  // States managing the delete event modal
  const [openDeleteEventModal, setOpenDeleteEventModal] = useState<boolean>(false);
  const [selectedEventToDelete, setSelectedEventToDelete] = useState<EventRush | null>(null);
  const [toDeleteEventNameInput, setToDeleteEventNameInput] = useState<string>("");

  // States managing the settings modal
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
  const [defaultRushTimeframeId, setDefaultRushTimeframeId] = useState<string>("");

  const [rushTimeframesCodeToggled, setRushTimeframeCodeToggled] = useState<Record<string, boolean>>({});

  // state to track copied status (for event.code)
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<SVGAElement>, event: EventRush) => {
    e.preventDefault();
    navigator.clipboard.writeText(event.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // First fetch: rush timeframes
        const resTimeframes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const timeframes: EventTimeframeRush[] = await resTimeframes.json();

        // Set timeframes + toggle state
        const timeframesCodeToggled = timeframes.reduce(
          (acc: Record<string, boolean>, timeframe: EventTimeframeRush) => {
            acc[timeframe.id] = false;
            return acc;
          },
          {}
        );
        setEventTimeframesRush(timeframes);
        setRushTimeframeCodeToggled(timeframesCodeToggled);

        // Set defaultRushTimeframeId
        const defaultRushTimeframe = timeframes.find(
          (tf) => tf.default_rush_timeframe
        );
        setDefaultRushTimeframeId(defaultRushTimeframe?.id ?? "");

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Stop the loading spinner
        setIsLoading(false);
      }
    };

    fetchData()
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

  const EventRow = ({ event, index, timeframeId: timeframeId }: { event: EventRush, index: number, timeframeId: string }) => {
    return (
      <Card className={`mb-3 ${AdminTextStyles.card}`} key={index}>
        <Link href={`/admin/rush/${timeframeId}/${event.id}`}>
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
                        {rushTimeframesCodeToggled[timeframeId] ? (`Code: ${event.code}`) : "Code: •••••••"}
                      </code>
                      {rushTimeframesCodeToggled[timeframeId] && (
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
                    eventCoverImage: event.event_cover_image,
                    eventCoverImageName: event.event_cover_image_name,
                    eventCoverImageVersion: event.event_cover_image_version,
                    eventId: event.id,
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
                href={`${getRushBaseUrl()}/checkin/${event.id}`}
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
          timeframe_id: selectedRushTimeframe?.id,
          name: eventFormData.eventName,
          code: eventCodeTrimmed,
          location: eventFormData.eventLocation,
          date: eventFormData.eventDate.toISOString(),
          deadline: eventFormData.eventDeadline.toISOString(),
          event_cover_image : eventFormData.eventCoverImage,
          event_cover_image_name : eventFormData.eventCoverImageName,
          event_cover_image_version: eventFormData.eventCoverImageVersion,
          ...(modifying && { id: eventFormData.eventId })
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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${selectedEventToDelete?.id}`, {
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
  const handleUpdateSettings = async (defaultRushTimeframeId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          default_rush_timeframe_id: defaultRushTimeframeId
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
        {eventTimeframesRush.map((data: EventTimeframeRush, index) => (
          <Accordion key={index} collapseAll className="mb-2">
            <Accordion.Panel>
              <Accordion.Title>
                <div className="flex flex-row items-center gap-3">
                  <div className="text-m font-medium text-gray-900 dark:text-white">{data.name}</div>
                  {data.default_rush_timeframe && <Badge color="teal">default</Badge>}
                </div>
              </Accordion.Title>
              <Accordion.Content className="dark:bg-background-dark">
                <div className="flex flex-row items-center w-full mb-4 overflow-x-auto">
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setSelectedRushTimeframe(data); setOpenCreateEventModal(true) }}>Create Event</Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => { setRushTimeframeCodeToggled({ ...rushTimeframesCodeToggled, [data.id]: !rushTimeframesCodeToggled[data.id] }); }}>
                    {rushTimeframesCodeToggled[data.id] ? "Hide Code" : "Show Code"}
                  </Button>
                  <Button size="xs" color="gray" className="mr-2" onClick={() => window.open(`/admin/rush/${data.id}/analytics`, '_blank', 'noopener,noreferrer')}>
                    View Analytics
                  </Button>
                  <Button size="xs" color="gray" className="mr-2" disabled>Export Data</Button>
                </div>
                {data.events_rush && data.events_rush.map((event: EventRush, index: number) => (
                  <EventRow event={event} index={index} key={index} timeframeId={data.id} />
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
        selectedRushTimeframe={selectedRushTimeframe}
        eventFormData={eventFormData}
        isSubmitting={isSubmitting}
        setEventFormData={setEventFormData}
        onClose={onCloseCreateEventModal}
        onSubmit={() => handleRusheeEvent()}
      />

      <EventModal
        showModal={openModifyEventModal}
        selectedRushTimeframe={selectedRushTimeframe}
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
        defaultRushTimeframeId={defaultRushTimeframeId}
        rushTimeframes={eventTimeframesRush}
        onClose={() => setOpenSettingsModal(false)}
        onSubmit={(defaultRushTimeframeId) => handleUpdateSettings(defaultRushTimeframeId)}
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