"use client"
import { Card, Badge } from 'flowbite-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';


interface ResponseCardProp {
    question: string;
    answer: string;
}

export default function ResponseCard(props: ResponseCardProp) {

    const textStyles = {
        question: "text-lg font-medium text-gray-900",
        answer: "text-md text-gray-800"
    }

    return (
        <div className="flex flex-col max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
            <div className="p-4 flex flex-row items-center bg-slate-50">
                <div className="w-24">
                    <span className="w-1 bg-purple-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Question</span>
                </div>
                <h5 className={textStyles.question}>{props.question}</h5>
            </div>
            <div className="p-4 flex flex-row">
                <div className="w-24">
                    <span className="w=10 bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Answer</span>
                </div>
                <h5 className={textStyles.answer}>{props.answer}</h5>
            </div>
        </div>
    )
}