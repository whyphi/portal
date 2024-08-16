"use client"
import React, { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import Loader from "@/components/Loader";
import { AdminTextStyles } from "@/styles/TextStyles";
import { useThemeMode } from "flowbite-react";

export default function Members() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("")
  const { mode } = useThemeMode();

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        setUserId(session.token._id);
        setUserEmail(session.token.email);
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) return <Loader />

  return (
    <div className="overflow-x-auto">
      <h1 className={AdminTextStyles.title}>{`QR Code (Check-in)`}</h1>
      <p className={AdminTextStyles.paragraph}>Not working? Contact PCT Tech Team!</p>
      <div className="flex justify-center mt-12">
        <QRCodeSVG 
          value={JSON.stringify({ id: userId, email: userEmail })}
          size={320}
          bgColor={`${mode === "dark" ? `#29313e` : `#FFFFFF`}`}
          fgColor={`${mode === "dark" ? `#FFFFFF` : `#29313e`}`}
        />
      </div>
    </div>
  );
}
