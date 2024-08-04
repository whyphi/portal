"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/AdminLoader";
import { AdminTextStyles } from "@/styles/TextStyles";
import { Analytics } from "@/types/admin/events";
import { Badge, Drawer, Table } from "flowbite-react";
import { useEffect, useState } from "react";

export default function RushAnalytics({ params }: { params: { categoryId: string } }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>();
  const [error, setError] = useState<Error>();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all rush categories and events from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${params.categoryId}/analytics`, {
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

    {token && fetchAnalytics();}
  }, [token]);

  const renderAnalyticsTable = () => {
    if (!analytics) return
    return Object.keys(analytics.attendees).map((email) => (
      <Table.Row key={email} className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {analytics.attendees[email].name}
        </Table.Cell>
        <Table.Cell>{analytics.attendees[email].email}</Table.Cell>
        <Table.Cell>{analytics.attendees[email].eventsAttended.length}</Table.Cell>
        {/* TODO: create function to determine if the candidate can be accepted for interview */}
        <Table.Cell>{analytics.attendees[email].eventsAttended.length > 4 ? "True" : "False"}</Table.Cell>
        <Table.Cell>
          <a onClick={handleOpen} className="font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500">
            Details
          </a>
        </Table.Cell>
      </Table.Row>
    ));
  }

  if (isLoading || !analytics) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <h1 className={`flex items-center gap-2 ${AdminTextStyles.subtitle}`}>
        Rush Analytics
        <Badge size="lg">{analytics.categoryName}</Badge>
      </h1>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Events Attended</Table.HeadCell>
          <Table.HeadCell>Threshold</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Details</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {renderAnalyticsTable()}
        </Table.Body>
      </Table>

      <Drawer className="z-50" open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header title="Drawer" />
        <Drawer.Items>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            In progress...
          </p>
          
        </Drawer.Items>
      </Drawer>
    </div>
  )
}