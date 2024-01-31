"use client"

import React, { useState, useEffect } from "react";
import Form from "@/components/Form"
import Loader from "@/components/Loader";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";

interface PreviewListingData {
  title: string;
  // questions: { [key: string]: string }[];
  questions: [] | [{ question: string, context: string }];
  deadline: string;
  includeEventsAttended: boolean;
  dateCreated: string;
}


export default function previewListing() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listingData, setListingData] = useState<PreviewListingData>({
    deadline: "",
    dateCreated: "",
    questions: [],
    title: "",
    includeEventsAttended: false
  });

  function unflattenQuestions(urlSearchParams: ReadonlyURLSearchParams): { [key: string]: string }[] {
    // Extract parameters with names starting with 'questions'
    const questionParams = Array.from(urlSearchParams.entries())
      .filter(([paramName]) => paramName.startsWith('questions'))
      .reduce((acc, [paramName, paramValue]) => {
        const [index, key] = (paramName.match(/\[(\d+)\]\.(.+)/)?.slice(1) || []) as [number, string];
        if (!acc[index]) {
          acc[index] = {};
        }
        acc[index][key] = paramValue;
        return acc;
      }, [] as { [key: string]: string }[]);

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

  }, [])

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form
        title={listingData.title}
        questions={listingData.questions}
        listingId={null}
        includeEventsAttended={listingData.includeEventsAttended}
        isPreview={true}
      />
    </main>
  );
}
