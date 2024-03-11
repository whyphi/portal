"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getSession } from 'next-auth/react';


export default function Onboarding() {
  const [name, setName] = useState<string>("");
  const [currStep, setCurrStep] = useState<number>(0);

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        setName(session?.user?.name)
      }

    });
  }, []);

  const StepOne = () => {
    return (
      <div>
        <h1>Hi, {name}!</h1>
      </div>
    )
  }

  if (currStep === 0) {
    return (StepOne())
  }

  return (
    <div>
      test
    </div>
  );
}
