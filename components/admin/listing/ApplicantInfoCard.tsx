"use client";
import { Card } from "flowbite-react";
import Image from "next/image";
import { Applicant } from "@/types/applicant";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { AiFillLinkedin } from "react-icons/ai";
import { MdWeb } from "react-icons/md";

import Link from "next/link";

interface ApplicantInfoCardProps {
  applicant: Applicant;
}

export default function ApplicantInfoCard({ applicant }: ApplicantInfoCardProps) {
  const textStyles = {
    name: "text-xl font-bold dark:text-white",
    college: "text-md font-extralight text-gray-700 pt-2",
    major: "text-md font-extralight text-gray-700",
    gpa: "text-md font-extralight text-gray-700 pb-2",
    link: "text-base font-normal leading-tight text-blue-500 dark:text-gray-400 underline",
    gradDate: "text-sm font-extralight text-gray-600",
    applicantStatus: "bg-green-500 px-4 rounded-xl inline-block",
  };

  // Filter the colleges that are true and format them with year
  const trueColleges = Object.keys(applicant.colleges)
    .filter((college) => applicant.colleges[college])
    .map((college) => `${college}`); // Modify

  return (
    <Card>
      <ul className="space-y-2">
        <div className="flex justify-center">
          <Image
            loader={() => applicant.image}
            alt={`${applicant.firstName} ${applicant.lastName} image`}
            className="mb-3 rounded-full"
            height={96}
            src={applicant.image}
            width={96}
          />
        </div>
        <h3 className={textStyles.name}>{`${applicant.firstName} ${applicant.lastName}`}</h3>
        {applicant.preferredName == "" ? (
          <></>
        ) : (
          <h5 className="pb-2 text-sm text-gray-500">({applicant.preferredName})</h5>
        )}
        <p className={textStyles.gradDate}>{`${applicant.gradMonth} ${applicant.gradYear}`}</p>
        <div className="pb-3">
          {" "}
          {/* TODO: fix jank padding*/}
          <div className={textStyles.applicantStatus}>Interviewing</div>{" "}
        </div>
        {/* TODO: add applicant.status and render different colors based on it */}
        <hr className="h-1 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" />
        <p className={textStyles.college}>College(s): {trueColleges.join(", ")}</p>
        <p className={textStyles.major}>Major: {applicant?.major}</p>
        {applicant.minor && <p className={textStyles.major}>Minor: {applicant.minor}</p>}
        <p className={textStyles.gpa}>GPA: {applicant.hasGpa ? applicant?.gpa : "N/A"}</p>
        <hr className="h-1 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" />
        <li className="flex space-x-3 items-center pt-2">
          <HiOutlinePhone className="text-gray-500" />
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
            {applicant?.phone}
          </span>
        </li>
        <li className="flex space-x-3 items-center">
          <HiOutlineMail className="text-gray-500" />
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
            {applicant?.email}
          </span>
        </li>
        {applicant.linkedin != "" ? (
          <li className="flex space-x-3 items-center">
            <AiFillLinkedin className="text-gray-500" />
            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <Link
                className={textStyles.link}
                href={applicant.linkedin}
                rel="noopener noreferrer"
                target="_blank">
                Click Here
              </Link>
            </span>
          </li>
        ) : (
          <></>
        )}
        {applicant.website != "" ? (
          <li className="flex space-x-3 items-center">
            <MdWeb className="text-gray-500" />
            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <Link
                className={textStyles.link}
                href={applicant.website}
                rel="noopener noreferrer"
                target="_blank">
                Click Here
              </Link>
            </span>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </Card>
  );
}
