"use client"
import React, { useState, useEffect } from "react";
import { Table } from 'flowbite-react';
import { Member } from "@/types/admin/members";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Members() {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Member[]) => {
        setMembers(data);
        // setIsLoading(false)
      })
      .catch((error) => console.error("Error fetching listings:", error));

  }, [token]);

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-8 text-sm font-normal text-gray-500 dark:text-gray-400",
  };


  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>PCT Members</h1>
      <p className={textStyles.subtitle}>See something incorrect? Contact PCT Tech Team!</p>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {members.map((data, index) => (
            <Table.Row
              key={index}
              className={`bg-white dark:border-gray-700 dark:bg-gray-800`}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {data.name}
              </Table.Cell>
              <Table.Cell>{data.email}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
