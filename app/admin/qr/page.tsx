"use client"
import React, { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import Loader from "@/components/Loader";

export default function Members() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        setUserId(session.token._id);
        setIsLoading(false);
      }
    });
  }, []);

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-8 text-sm font-normal text-gray-500 dark:text-gray-400",
  };

  if (isLoading) return <Loader />

  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>{`QR Code (Check-in)`}</h1>
      <p className={textStyles.subtitle}>Not working? Contact PCT Tech Team!</p>
      <div className="flex justify-center mt-12">
        <QRCodeSVG value={userId} size={320} />
      </div>
    </div>
  );
}
