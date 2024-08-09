"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Timeframe } from "@/types/admin/events";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Button, Modal } from 'flowbite-react';
import { AdminTextStyles, DimmedAdminTextStyles } from "@/styles/TextStyles";

export default function TimeframeSetting({ params }: { params: { timeframeId: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<Timeframe>();

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timeframes/${params.timeframeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeframe(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/timeframes/${params.timeframeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/admin/events/settings");
      } else {
        console.error("Delete request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/events/settings" passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>
      <div className="flex flex-col justify-between">
        <h1 className={AdminTextStyles.title}>Timeframe Settings</h1>
        <p className={`mt-2 ${DimmedAdminTextStyles.default}`}>Name: {timeframe?.name}</p>
        <p className={`mt-1 mb-4 ${DimmedAdminTextStyles.default}`}>ID: {params.timeframeId}</p>


        <div className="flex flex-col border border-red-500 dark:border-red-400 rounded-t-lg mt-6 p-4">
          <h3 className={AdminTextStyles.default}>Delete Timeframe</h3>
          <p className={DimmedAdminTextStyles.subtext}>Permanently remove the timeframe and all its associated content and data from the Whyphi platform. This action is not reversible, so please continue with caution.</p>
        </div>

        <div className="flex justify-end border border-red-500 dark:border-red-400 rounded-b-lg p-2 bg-red-200 dark:bg-red-300">
          <Button
            gradientMonochrome="failure"
            onClick={() => setOpenModal(true)}
          >
            Delete
          </Button>
        </div>

        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Delete Timeframe</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Permanently remove the timeframe and all its associated content and data from the Whyphi platform. This action is not reversible, so please continue with caution.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this timeframe?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button gradientMonochrome="failure" onClick={handleDelete}>Delete</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

