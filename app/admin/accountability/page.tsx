"use client"
import React, { useState, useEffect } from "react";
import { Table, Progress, Button } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";

export default function Accountability() {
  const { token } = useAuth();
  const [accountability, setAccountability] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accountability`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAccountability((prevState) => [...prevState, ...data]);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  if (isLoading) {
    return <Loader />
  }

  const showNextPage = () => {
    setPage(page + 1);
  };

  const slicedAccountability = accountability.slice(0, 20 * page);

  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>Accountability Tracker</h1>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Points</Table.HeadCell>
          <Table.HeadCell>Progress</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {slicedAccountability.map((data, index) => (
            <Table.Row
              key={index}
              className={`bg-white dark:border-gray-700 dark:bg-gray-800`}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {data.name}
              </Table.Cell>
              <Table.Cell>{data.currentPoints}</Table.Cell>
              <Table.Cell>
                <Progress
                  progress={data.currentPoints / data.required * 100}
                  color={data.currentPoints >= data.required ? "green" : "purple"} // Change color to green if points are 100 or more
                />
              </Table.Cell>
            </Table.Row>
          ))}
          {accountability.length > slicedAccountability.length && (
            <tr>
              <td colSpan={3} className="text-center">
                <Button onClick={showNextPage}>Load More</Button>
              </td>
            </tr>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

