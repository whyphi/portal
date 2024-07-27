"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth, getUserId } from "@/app/contexts/AuthContext";
import { getSession } from 'next-auth/react';



export default function ListingSettings({ params }: { params: { listingId: string } }) {
  const { token } = useAuth();
  const _id = getUserId();
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/member/${_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [_id, token]); // Include _id and token in the dependency array

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  return (
    <div>
      {_id && <div>{_id}</div>}
      Account Settings
    </div>
  );
}

