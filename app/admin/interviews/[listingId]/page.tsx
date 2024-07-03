"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import InterviewForm from "@/components/InterviewForm";
import Loader from "@/components/Loader";

interface InterviewListing {
  _id: string;
  title: string;
  instructions: string;
  semester: string; // TO-DO: Change this into a reference for a timeframe object?
  active: boolean;
  questions: string[];
  dateCreated: string;
  isVisible: boolean;
  type: "case" | "technical" | "behavioral" | "other" | null;
}

export default function Listing({ params }: { params: { listingId: string } }) {
  const { token } = useAuth();
  const [interviewInfo, setInterviewInfo] = useState<InterviewListing>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/interviews/${params.listingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: InterviewListing) => {
        setInterviewInfo(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  if (isLoading) return <Loader />;

  return (
    <div>
      {interviewInfo ? (
        <div>
          <InterviewForm
            title={interviewInfo.title}
            instructions={interviewInfo.instructions}
            semester={interviewInfo.semester}
            questions={interviewInfo.questions}
            listingId={params.listingId}
            isPreview={true}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
