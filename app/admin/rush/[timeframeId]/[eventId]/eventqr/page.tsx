"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { AdminTextStyles, DimmedAdminTextStyles } from "@/styles/TextStyles";
import Loader from "@/components/Loader";
import { QRCodeSVG } from "qrcode.react";
import { useThemeMode } from "flowbite-react";
import { EventRush } from "@/types/admin/events";
import { getRushBaseUrl } from "@/utils/getBaseURL";

export default function RushEventQR({
  params,
}: {
  params: { timeframeId: string; eventId: string };
}) {
  const { token } = useAuth();
  const { mode } = useThemeMode();
  const [event, setEvent] = useState<EventRush | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  const getSvgObjectUrl = useCallback(() => {
    if (!qrContainerRef.current) return null;
    const svgElement = qrContainerRef.current.querySelector("svg");
    if (!svgElement) return null;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    return URL.createObjectURL(blob);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/rush/${params.eventId}?hideAttendees=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch rush event");
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching rush event:", err);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchEvent();
    }
  }, [token, params.eventId]);

  if (isLoading) return <Loader />;

  if (!event) {
    return (
      <div className="space-y-6">
        <h1 className={AdminTextStyles.subtitle}>Error</h1>
        <p className={DimmedAdminTextStyles.default}>Rush event not found.</p>
      </div>
    );
  }

  const rushBaseUrl = getRushBaseUrl();
  const qrUrl = `${rushBaseUrl}/checkin/${event.id}`;

  const handleOpenQr = () => {
    const url = getSvgObjectUrl();
    if (!url) {
      console.error("Failed to generate QR code URL");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadQr = () => {
    const url = getSvgObjectUrl();
    if (!url) {
      console.error("Failed to generate QR code URL");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name}-rush-qr.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Link href={`/admin/rush/${params.timeframeId}/${params.eventId}`} passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>

      <h1 className={AdminTextStyles.subtitle}>
        {event.name} - Rush QR Check-In
      </h1>
      <p className={DimmedAdminTextStyles.default}>
        Scan this QR code to automatically check in to the rush event.
      </p>

      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg" ref={qrContainerRef}>
          <QRCodeSVG
            value={qrUrl}
            size={320}
            bgColor={mode === "dark" ? "#29313e" : "#FFFFFF"}
            fgColor={mode === "dark" ? "#FFFFFF" : "#29313e"}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleOpenQr}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Open QR in New Tab
          </button>
          <button
            onClick={handleDownloadQr}
            className="px-3 py-1 text-sm font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}