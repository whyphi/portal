"use client"

import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/AdminLoader";
import { Analytics } from "@/types/admin/events";
import { Table, Drawer } from "flowbite-react";
import { useEffect, useState } from "react";

export default function RushAnalytics({ params }: { params: { categoryId: string } }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [error, setError] = useState<Error>();
  const [isOpen, setIsOpen] = useState(true);

  const handleDrawerClose = () => setIsOpen(false);


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

      {/* Drawer used to display list of events */}
      <Drawer open={isOpen} onClose={handleDrawerClose} position="right">
        <Drawer.Header title="Drawer" />
        <Drawer.Items>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Supercharge your hiring by taking advantage of our&nbsp;
            <a href="#" className="text-cyan-600 underline hover:no-underline dark:text-cyan-500">
              limited-time sale
            </a>
            &nbsp;for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates and the #1 design
            job board.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href="#"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Learn more
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Get access&nbsp;
              <svg
                className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </Drawer.Items>
      </Drawer>
    </div>
  )
}