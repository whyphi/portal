"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/AdminLoader";
import { Analytics } from "@/types/admin/events";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

export default function RushAnalytics({ params }: { params: { categoryId: string } }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [error, setError] = useState<Error>();

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
    return Object.keys(analytics).map((email) => (
      <Table.Row key={email} className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {analytics[email].name}
        </Table.Cell>
        <Table.Cell>{analytics[email].email}</Table.Cell>
        <Table.Cell>{analytics[email].eventsAttended.length}</Table.Cell>
        {/* TODO: create function to determine if the candidate can be accepted for interview */}
        <Table.Cell>{analytics[email].eventsAttended.length > 4 ? "True" : "False"}</Table.Cell>
        <Table.Cell>
          <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
            Details
          </a>
        </Table.Cell>
      </Table.Row>
    ));
  }

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Rush Analytics</h1>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Events Attended</Table.HeadCell>
          <Table.HeadCell>Threshold</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {renderAnalyticsTable()}
        </Table.Body>
      </Table>
    </div>
  )
}