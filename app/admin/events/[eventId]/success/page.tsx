"use client"

import SuccessIcon from "@/components/admin/events/checkin/success/SuccessIcon";
import Loader from "@/components/Loader";
import { AdminTextStyles, DimmedAdminTextStyles } from "@/styles/TextStyles";
import { useThemeMode } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Success() {

  const { mode } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mode) setIsLoading(false);
  },[mode])

  if (isLoading) return <Loader />

  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <SuccessIcon mode={mode} />
        <h1 className={AdminTextStyles.title}>You&apos;re all checked in.</h1>
        <p className={DimmedAdminTextStyles.default}>Thank you for your interest in Phi Chi Theta, Zeta Chapter!</p>
      </div>
    </div>
  );
}


