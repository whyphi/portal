"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import SummaryCard from "@/components/admin/listing/insights/SummaryCard"
import { AdminTextStyles } from "@/styles/TextStyles"
import { RushEvent } from "@/types/admin/events";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Badge, Button, Clipboard, Table } from "flowbite-react";
import Timestamp from "react-timestamp";

export default function RushEventPage({ params }: { params: { eventId: string } }) {
  const { token } = useAuth();
  const [rushEvent, setRushEvent] = useState<RushEvent | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch rush event from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${params.eventId}`, {
          method: "POST",
          body: JSON.stringify({ hideCode: false }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        const data = await response.json()
        setRushEvent(data);
        setIsLoading(false);

      } catch (error) {
        console.error(error);
      }
    }

    fetchEventData();
  }, [token]);

  const renderEventStatus = () => {
    if (!rushEvent) return;
    const now = new Date();
    const eventDate = new Date(rushEvent.date);
    const eventDeadline = new Date(rushEvent.deadline);
    if (now < eventDate) {
      return <Badge color="warning">Event upcoming</Badge>;
    } else if (now < eventDeadline) {
      return <Badge color="success">In progress</Badge>;
    } else {
      return <Badge color="failure">Event passed</Badge>
    }
  }

  const renderCodeTitle = () => {
    return (
    <div className="flex gap-3 items-center justify-between">
      Code
      <Button size="xs" color="gray" onClick={() => setShowCode((code) => !code)}>
        {showCode ? "Hide code" : "Show code"}
      </Button>
    </div>
    )
  }

  const renderCode = () => {
    if (!rushEvent) return;
    return (
    <div className="relative">
      <code>
        {showCode ? (`${rushEvent.code}`) : "•••••••"}
      </code>
      {showCode && (
        <Clipboard.WithIconText valueToCopy={rushEvent.code} />
      )}
    </div>
    )
  }
  
  const renderAttendeeTable = () => {
    if (!rushEvent) return;
    return rushEvent.attendees.map((attendee) => (
      <Table.Row 
        key={attendee.email}
        className="bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <Table.Cell>{attendee.name}</Table.Cell>
        <Table.Cell>{attendee.email}</Table.Cell>
        <Table.Cell>{<Timestamp date={new Date(attendee.checkinTime)}/>}</Table.Cell>
      </Table.Row>
    ));
  }

  if (isLoading || !rushEvent) return <Loader />

  return (
    <div>
      <h1 className={AdminTextStyles.title}>{rushEvent.name}</h1>
      <h3 className={`flex items-center gap-2 ${AdminTextStyles.subtitle}`}>
        Status:
        {renderEventStatus()}
      </h3>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <SummaryCard title="Number of Attendees" value={rushEvent.numAttendees} />
        <SummaryCard title="Location" value={rushEvent.location} />
        <SummaryCard title={renderCodeTitle()} value={renderCode()} />
        <SummaryCard title="Event Date" value={<Timestamp date={new Date(rushEvent.date)}/>} />
        <SummaryCard title="Event Deadline" value={<Timestamp date={new Date(rushEvent.deadline)}/>} />
        <SummaryCard title="Last Modified" value={<Timestamp date={new Date(rushEvent.lastModified)}/>} />
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Checkin Time</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {renderAttendeeTable()}
        </Table.Body>
      </Table>
    </div>
  )
}