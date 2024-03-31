"use client"

import React, { useState } from 'react';
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { QrReader } from '@cmdnio/react-qr-reader';


export default function CheckInPage() {
  const { token } = useAuth();
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupCode, setPopupCode] = useState<string | null>(null);
  const searchParams = useSearchParams()

  const eventId = searchParams.get("eventId")
  const eventName = searchParams.get("eventName");

  var isProcessing = false;

  return (
    <div className="space-y-6">
      <Link href={`/admin/events/${eventId}`} passHref>
        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <HiArrowNarrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </Link>

      <h1 className="text-3xl font-bold">{eventName}</h1>
      <p className="text-sm text-gray-500">Scan your personal QR-Code to get checked in to this event!</p>
      <div>
        <QrReader
          className="max-w-md mx-auto rounded-lg"
          containerStyle={{
            width: "100%",
            margin: "0 auto",
          }}
          videoContainerStyle={{
            width: "100%",
            height: "auto",
            borderRadius: "5px",
            border: "3px solid rgba(0, 0, 0, 0.2)",
            boxShadow: "0 0 rgba(0, 0, 0, 0.2)",
          }}
          videoStyle={{
            width: "100%",
            height: "100%"
          }}
          constraints={{
            facingMode: "environment"
          }}
          scanDelay={1000}
          onResult={async (result) => {
            if (result && !isProcessing) {
              const userId = result.getText();

              isProcessing = true;
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/checkin`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ userId })
                });
                if (!response.ok) {
                  const { Message, Code } = await response.json();
                  setPopupMessage(Message);
                  setPopupCode(Code);
                } else {
                  const { message } = await response.json();
                  setPopupMessage(message);
                }
              } catch (error) {
                setPopupMessage("" + error);
              } finally {
                setTimeout(() => {
                  isProcessing = false
                  setPopupMessage(null);
                  setPopupCode(null);
                }, 2000); // block api requests for 2 seconds
              }
            }
          }}
        />
        {popupMessage && (
          <div
            className={`p-4 mt-4 text-sm ${popupCode === "NotFoundError" || popupCode === "BadRequestError"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
              } rounded-lg dark:bg-red-200 dark:text-red-800`}
            role="alert"
          >
            <span className="font-medium">{popupMessage}</span>
          </div>
        )}




      </div>
    </div>
  );
}





