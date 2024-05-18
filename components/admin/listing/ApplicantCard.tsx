"use client"
import { Card } from 'flowbite-react';
import Image from 'next/image'
import { Applicant } from '@/types/applicant';
import { useRouter } from 'next/navigation';

interface ApplicantCardProps {
  listingId: string;
  applicant: Applicant;
  index: number;
  setSelectedApplicant: (applicant: Applicant) => void;
  setSelectedApplicantIndex: (index: number) => void;
}

export default function ApplicantCard({ listingId, applicant, index, setSelectedApplicant, setSelectedApplicantIndex }: ApplicantCardProps) {
  const router = useRouter();
  const { colleges } = applicant;

  // Filter the colleges that are true and format them with year
  const trueColleges = Object.keys(colleges)
    .filter(college => colleges[college])
    .map(college => `${college}`); // Modify 

  // WILL : need to change this line of code in order for data-analytics to work properly (gradYear should just be the year...)
  const gradYear = applicant.gradYear.split(' ').pop();

  return (
    <Card 
      className="cursor-pointer" 
      onClick={() => {
        setSelectedApplicant(applicant);
        setSelectedApplicantIndex(index);
        }}
      >
      <div className="flex flex-col items-center mb-1">
        <Image
          width={96}
          height={96}
          loader={() => applicant.image}
          alt={`${applicant.firstName} ${applicant.lastName} image`}
          className="w-24 h-24 mb-3 shadow-lg relative mx-auto rounded-full overflow-hidden object-cover"
          src={applicant.image}
        />
        <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
          {`${applicant.firstName} ${applicant.lastName}`}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {`${applicant.major} | ${trueColleges.join(', ')} ${gradYear}`}
        </span>
      </div>
    </Card>
  )
}