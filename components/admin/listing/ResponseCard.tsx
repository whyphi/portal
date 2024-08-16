"use client"
import { AdminTextStyles } from '@/styles/TextStyles';
import { Badge } from 'flowbite-react';


interface ResponseCardProp {
    question: string;
    answer: string;
}

export default function ResponseCard(props: ResponseCardProp) {
  return (
    <div className={`flex flex-col max-w-3xl border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4`}>
      <div className="p-4 flex flex-row gap-2 items-center rounded-t-lg bg-slate-50 dark:bg-slate-600">
        <Badge color="purple">Question</Badge>
        <h5 className={AdminTextStyles.default}>{props.question}</h5>
      </div>
      <div className="p-4 flex flex-row gap-2">
        <Badge color="gray">Answer</Badge>
        <h5 className={AdminTextStyles.content}>{props.answer}</h5>
      </div>
    </div>
  )
}