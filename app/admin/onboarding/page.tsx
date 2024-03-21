"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getSession } from 'next-auth/react';
import { Timeline, Button, FloatingLabel } from 'flowbite-react';
import { AdminTextStyles } from "@/styles/TextStyles";




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

  const nextStep = () => {
    setCurrStep(currStep + 1);
  };

  const StepOne = () => {
    return (
      <div>
        <h1 className={AdminTextStyles.title}>Hi {name}!</h1>

        <p className={AdminTextStyles.subparagraph}>To get you started on WhyPhi,</p>
        <p className={AdminTextStyles.paragraph}>{`We're going to be asking some questions.`}</p>

        <Timeline>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#1</Timeline.Time>
              <Timeline.Title>Personal Details</Timeline.Title>
              <Timeline.Body>
                College, Graduation Year
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#2</Timeline.Time>
              <Timeline.Title>PCT-related Information</Timeline.Title>
              <Timeline.Body>
                What class are you in? What team are you a part of? What family are you in?
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#3</Timeline.Time>
              <Timeline.Title>Next Steps</Timeline.Title>
              <Timeline.Body>
                You should be all set to start using WhyPhi!
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
        <div className="flex flex-row justify-end">
          <Button className="w-28" color="purple" onClick={nextStep}>Next</Button>
        </div>
      </div>
    )
  }

  const StepTwo = () => {
    return (
      <div>
        <div>
          {/* TODO: Add Back */}
        </div>
        <div>
          <h2 className={AdminTextStyles.subtitle}>Personal Details</h2>
          <p className={AdminTextStyles.subparagraph}>{`We're asking these details so other members can get more information about you through our database!`}</p>
          <div className="mt-4"></div>
          <FloatingLabel variant="standard" label="College" />
          <FloatingLabel variant="standard" label="Graduation Year" />
        </div>
      </div>

    )
  }

  if (currStep === 0) {
    return (StepOne())
  }

  if (currStep === 1) {
    return (StepTwo())
  }

  return (
    <div>
      test
    </div>
  );
}
