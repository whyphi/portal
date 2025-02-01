"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/AdminLoader";
import { AdminTextStyles } from "@/styles/TextStyles";
import { Analytics } from "@/types/admin/events";
import { getPortalBaseUrl } from "@/utils/getBaseURL";
import { isRushThresholdMetAnalytics } from "@/utils/getRushThreshold";
import { Badge, Drawer, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import SummaryCard from "@/components/admin/listing/insights/SummaryCard";
import { getMostPopularEvent, getNumRegisteredRushees, getPercentageRushThresholdMet } from "@/utils/admin/rush/analytics";

export default function RushAnalytics({ params }: { params: { categoryId: string } }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>();
  const [error, setError] = useState<Error>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttendeeEmail, setSelectedAttendeeEmail] = useState<string | null>(null);

  const handleOpen = (email: string) => {
    setIsOpen(true);
    setSelectedAttendeeEmail(email);
  };
  const handleClose = () => {
    setIsOpen(false);
    setSelectedAttendeeEmail(null);
  };

  const handleDetailClick = (eventId: string) => {
    const url = `${getPortalBaseUrl()}/admin/rush/${params.categoryId}/${eventId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all rush categories and events from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/category/${params.categoryId}/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Analytics = await response.json()
        setAnalytics(data);
        // Stop the loading spinner
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error(String(error)));
        }
        console.error(error);
      }
    };

    { token && fetchAnalytics(); }
  }, [token]);

  const renderAnalyticsTable = () => {
    if (!analytics) return;
    return Object.keys(analytics.attendees).map((email) => (
      <Table.Row
        onClick={() => handleOpen(email)}
        key={email}
        className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
      >
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {analytics.attendees[email].name}
        </Table.Cell>
        <Table.Cell>{analytics.attendees[email].email}</Table.Cell>
        <Table.Cell>{analytics.attendees[email].eventsAttended.length}</Table.Cell>
        {/* TODO: create function to determine if the candidate can be accepted for interview (this can be handled potentially via Vault */}
        <Table.Cell>
          {isRushThresholdMetAnalytics(analytics.attendees[email].eventsAttended)
            ? <Badge color="success" className="inline-block">True</Badge>
            : <Badge color="failure" className="inline-block">False</Badge>}
        </Table.Cell>
      </Table.Row>
    ));
  }

  const renderAnalyticsDetailTable = () => {
    if (!(analytics && selectedAttendeeEmail)) return;
    return analytics.events.map((event) => (
      <Table.Row
        onClick={() => handleDetailClick(event.eventId)}
        key={event.eventId}
        className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
      >
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {event.eventName}
        </Table.Cell>
        <Table.Cell>
          {analytics.attendees[selectedAttendeeEmail].eventsAttended.find((attendeeEvent) => attendeeEvent.eventId == event.eventId)
            ?
            <Badge color="success" className="inline-block">Yes</Badge>
            :
            <Badge color="failure" className="inline-block">No</Badge>
          }
        </Table.Cell>
      </Table.Row>
    ))
  }

  if (isLoading || !analytics) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <h1 className={`flex items-center gap-2 ${AdminTextStyles.subtitle}`}>
        Rush Analytics
        <Badge size="lg">{analytics.categoryName}</Badge>
      </h1>
      <div>
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <SummaryCard title="Number of Registered Rushees" value={getNumRegisteredRushees(analytics)} />
          <SummaryCard title="Percentage of Rushees Meeting Event Criteria" value={getPercentageRushThresholdMet(analytics)} />
          <SummaryCard title="Most Popular Event" value={getMostPopularEvent(analytics)} />
        </div>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Events Attended</Table.HeadCell>
          <Table.HeadCell>Threshold</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {renderAnalyticsTable()}
        </Table.Body>
      </Table>

      <Drawer
        className="z-50 mt-16 bg-gray-50"
        backdrop={false}
        open={isOpen}
        onClose={handleClose}
        position="right"
      >
        <Drawer.Header title="Drawer" />
        <Drawer.Items>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Event</Table.HeadCell>
              <Table.HeadCell>Attended?</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {renderAnalyticsDetailTable()}
            </Table.Body>
          </Table>

        </Drawer.Items>
      </Drawer>
    </div>
  )
}
