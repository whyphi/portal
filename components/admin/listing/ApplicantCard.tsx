import { Card, Dropdown } from 'flowbite-react';
import Image from 'next/image'
import { Applicant } from '@/types/applicant';

interface ApplicantCardProps {
  applicant: Applicant;
}

export default function ApplicantCard({ applicant }: ApplicantCardProps) {
  const { colleges } = applicant;

  // Filter the colleges that are true and format them with year
  const trueColleges = Object.keys(colleges)
    .filter(college => colleges[college])
    .map(college => `${college}`); // Modify 

  const gradYear = applicant.gradYear.split(' ').pop();

  return (
    <Card>
      <div className="flex flex-col items-center pb-1">
        <Image
          alt={`${applicant.firstName} ${applicant.lastName} image`}
          className="mb-3 rounded-full shadow-lg"
          height={96}
          src={applicant.image}
          width={96}
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