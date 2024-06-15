"use client"

import React, { useState, useEffect } from "react";
import InterviewForm from "@/components/Form"
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";


interface Question {
  question: string;
  context: string;
}

interface InterviewPreviewListingData {
    title: string | null;
    semester: string | null; // TO-DO: this should eventually link to a timeframe. 
    questions: [] | { question: string, context: string }[];
    listingId: string | null;
    isPreview: boolean;
}


export default function PreviewListing() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<InterviewPreviewListingData>({
    title: "",
    semester: "", // TO-DO: this should eventually link to a timeframe. 
    questions: [],
    listingId: "",
    isPreview: false,
  });

  function unflattenQuestions(urlSearchParams: ReadonlyURLSearchParams): Question[] {
    // Extract parameters with names starting with 'questions'
    const questionParams = Array.from(urlSearchParams.entries())
      .filter(([paramName]) => paramName.startsWith('questions'))
      .reduce((acc, [paramName, paramValue]) => {
        const [index, key] = (paramName.match(/\[(\d+)\]\.(.+)/)?.slice(1) || []) as [number, string];
        if (!acc[index]) {
          acc[index] = { question: "", context: "" };
        }
        acc[index][key as keyof Question] = paramValue;
        return acc;
      }, [] as Question[]);

    return questionParams;
  }

  useEffect(() => {
    const deadline = searchParams.get('deadline') ?? ''
    const dateCreated = searchParams.get('dateCreated') ?? ''
    const questions = unflattenQuestions(searchParams) ?? []
    const title = searchParams.get('title') ?? ''
    const includeEventsAttended = searchParams.get('includeEventsAttended') == "true"  // boof as hell

    setListingData({
      deadline: deadline,
      dateCreated: dateCreated,
      questions: questions,
      title: title,
      includeEventsAttended: includeEventsAttended
    })

  }, [searchParams])

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <InterviewForm
        title={listingData.title}
        semester={listingData.semester}
        //  semester 
        //  instructions (for brothers)
        questions={listingData.questions}
        listingId={null}
        includeEventsAttended={listingData.includeEventsAttended}
        isPreview={true}
      />
    </main>
  );
}
