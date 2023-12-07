"use client"
import React, { useState } from "react";
import { Table, Progress } from 'flowbite-react';

export default function Accountability() {

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  var dummyData = [
    {
      name: "Person A",
      points: 17,
    },
    {
      name: "Person B",
      points: 12,
    },
    {
      name: "Person C",
      points: 20,
    },
    {
      name: "Person D",
      points: 33,
    },
    {
      name: "Person E",
      points: 1,
    },
    {
      name: "Person F",
      points: 0,
    },
    {
      name: "Person G",
      points: 28
    },
    {
      name: "Person H",
      points: 5,
    }
  ]

  const maxPoints = 30;

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
          {dummyData.map((data, index) => (
            <Table.Row
              key={index}
              className={`bg-white dark:border-gray-700 dark:bg-gray-800`}
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {data.name}
              </Table.Cell>
              <Table.Cell>{data.points}</Table.Cell>
              <Table.Cell><Progress progress={data.points / maxPoints * 100} color="purple" /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
