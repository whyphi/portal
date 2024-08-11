"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import SummaryCard from "@/components/admin/listing/insights/SummaryCard"
import { AdminTextStyles } from "@/styles/TextStyles"
import { RushEvent } from "@/types/admin/events";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Badge, Table } from "flowbite-react";
import Timestamp from "react-timestamp";

export default function RushEventPage({ params }: { params: { eventId: string } }) {
  const { token } = useAuth();
  const [rushEvent, setRushEvent] = useState<RushEvent | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch rush event from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${params.eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const getEventStatus = () => {
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
        {getEventStatus()}
      </h3>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <SummaryCard title="Number of Attendees" value={rushEvent.numAttendees} />
        <SummaryCard title="Location" value={rushEvent.location} />
        <SummaryCard title="Code" value={21} />
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