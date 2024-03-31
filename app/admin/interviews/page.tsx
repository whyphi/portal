"use client";
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";
import { FaPlus } from "react-icons/fa";

interface Listing {
  listingId: string;
  title: string;
  active: boolean;
  deadline: string;
  dateCreated: string;
  isVisible: boolean;
}

export default function Interviews() {
  const listings = [
    {
      listingId: "1234",
      title: "Case",
      active: true,
      deadline: "2024-02-07T05:00:00.000Z",
      dateCreated: "2024-01-06T06:02:59.394Z",
      isVisible: true,
    },
    {
      listingId: "1234",
      title: "Technical",
      active: true,
      deadline: "2024-02-07T05:00:00.000Z",
      dateCreated: "2024-01-06T06:02:59.394Z",
      isVisible: true,
    },
    {
      listingId: "1234",
      title: "Behavioral",
      active: true,
      deadline: "2024-02-07T05:00:00.000Z",
      dateCreated: "2024-01-06T06:02:59.394Z",
      isVisible: true,
    },
  ];

  return (
    <main className="container mx-auto px-8">
      <div className="flex flex-row justify-between">
        <p className="text-2xl font-semibold my-2">Interviews</p>
        <div className="flex flex-row space-x-2 hover:bg-slate-300 items-center border-2 p-2 border-purple-300 rounded-xl">
          <FaPlus />
          <p className="text-md">Create New Interview</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing, index) => (
          <div key={index} className="col-span-1">
            <ListingCard
              listingId={listing.listingId}
              title={listing.title}
              active={listing.isVisible}
              deadline={listing.deadline}
              dateCreated={listing.dateCreated}
              applicantCount={0}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
