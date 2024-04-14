"use client";
import { Card, Badge } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface InterviewCardProp {
  type: string;
  question: string;
  answer: string;
  notes: string;
  score: number;
}

export default function InterviewCard(props: InterviewCardProp) {
  const textStyles = {
    question: "text-md md:text-lg font-medium text-gray-900",
    answer: "text-sm md:text-md text-gray-800",
    notes: "text-sm md:text-md text-gray-800 font-semibold",
  };
  let typeColor;
  switch (props.type) {
    case "Behavioral":
      typeColor = "bg-emerald-200";
      break;
    case "Technical":
      typeColor = "bg-sky-300";
      break;
    case "Case":
      typeColor = "bg-orange-300";
      break;
  }
  const typeStyle = `w-1 ${typeColor} text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300`;

  return (
    <div className="flex flex-col max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
      <div className="p-4 flex flex-row items-center bg-slate-50">
        <div className="w-24">
          <span className={typeStyle}>{props.type}</span>
        </div>
        <h5 className={textStyles.question}>{props.question}</h5>
      </div>
      <div className="p-4 flex flex-row">
        <div className="w-24">
          <span className="w=10 bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            Answer
          </span>
        </div>
        <h5 className={textStyles.answer}>{props.answer}</h5>
      </div>
      {props.score ? (
        <div className="px-4 pt-4 pb-2 flex flex-row bg-sky-200">
          <div className="w-24">
            <span className="w=10 bg-blue-950 text-gray-100 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
              Score
            </span>
          </div>
          <h5 className={textStyles.notes}>{props.score}</h5>
        </div>
      ) : (
        <></>
      )}
      {props.notes ? (
        <div className="px-4 pb-4 pt-2 flex flex-row bg-sky-200">
          <div className="w-24">
            <span className="w=10 bg-blue-950 text-gray-100 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
              Notes
            </span>
          </div>
          <h5 className={textStyles.notes}>{props.notes}</h5>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
