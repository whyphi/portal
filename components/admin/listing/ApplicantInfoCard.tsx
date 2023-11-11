"use client"
import { Card } from 'flowbite-react';
import Image from 'next/image'
import { Applicant } from '@/types/applicant';
import { useRouter } from 'next/navigation';

interface ApplicantInfoCardProps {
  applicant: Applicant | null;
}


export default function ApplicantInfoCard({ applicant }: ApplicantInfoCardProps) {

  const textStyles = {
    name: "text-xl font-bold dark:text-white",
    major: "text-md font-extralight text-gray-700"

  }

  return (
    <Card>
      <ul className="space-y-5">
        <h3 className={textStyles.name}>{`${applicant?.firstName} ${applicant?.lastName}`}</h3>
        <p className={textStyles.major}>Major: {applicant?.major}</p>
        {applicant?.minor && <p className={textStyles.major}>Minor: {applicant?.minor}</p>}
        <li className="flex space-x-3">
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
            {applicant?.phone}
          </span>
        </li>
        <li className="flex space-x-3">
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
            {applicant?.email}
          </span>
        </li>
      </ul>

    </Card>
  )
}