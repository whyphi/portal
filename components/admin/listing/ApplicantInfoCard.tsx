"use client";
import { Badge, Card } from "flowbite-react";
import Image from "next/image";
import { Applicant } from "@/types/applicant";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { AiFillLinkedin } from "react-icons/ai";
import { MdWeb } from "react-icons/md";

import { AdminTextStyles, ThinAdminTextStyles } from "@/styles/TextStyles";
import { isRushThresholdMet } from "@/utils/getRushThreshold";

interface ApplicantInfoCardProps {
  applicant: Applicant;
}

export default function ApplicantInfoCard({
  applicant,
}: ApplicantInfoCardProps) {
  // Filter the colleges that are true and format them with year
  const trueColleges = Object.keys(applicant.colleges)
    .filter((college) => applicant.colleges[college])
    .map((college) => `${college}`); // Modify

  return (
    <Card>
      <ul className="space-y-4">
        <div className="flex justify-center">
          <Image
            loader={() => applicant.image}
            alt={`${applicant.first_name} ${applicant.last_name} image`}
            className="mb-3 rounded-full"
            height={96}
            src={applicant.image}
            width={96}
          />
        </div>
        <h3
          className={AdminTextStyles.paragraph}
        >{`${applicant.first_name} ${applicant.last_name}`}</h3>
        {applicant.preferred_name && (
          <h5 className="pb-2 text-sm text-gray-500">
            ({applicant.preferred_name})
          </h5>
        )}
        <p
          className={ThinAdminTextStyles.default}
        >{`${applicant.grad_month} ${applicant.grad_year}`}</p>

        <hr className="h-1 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" />

        <p className={ThinAdminTextStyles.default}>
          College(s): {trueColleges.join(", ")}
        </p>
        <p className={ThinAdminTextStyles.default}>Major: {applicant?.major}</p>
        {applicant.minor && (
          <p className={ThinAdminTextStyles.default}>
            Minor: {applicant.minor}
          </p>
        )}
        <p className={ThinAdminTextStyles.default}>
          GPA: {applicant.has_gpa ? applicant?.gpa : "N/A"}
        </p>

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
        {applicant.linkedin ? (
          <li className="flex space-x-3 items-center">
            <AiFillLinkedin className="text-gray-500" />
            <a
              href={
                applicant.linkedin.startsWith("http")
                  ? applicant.linkedin
                  : `https://${applicant.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge>{Constants.LINKEDIN_BADGE_TITLE}</Badge>
            </a>
          </li>
        ) : (
          <></>
        )}
        {applicant.website ? (
          <li className="flex space-x-3 items-center">
            <MdWeb className="text-gray-500" />
            <a
              href={
                applicant.website.startsWith("http")
                  ? applicant.website
                  : `https://${applicant.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge color="purple">{Constants.WEBSITE_BADGE_TITLE}</Badge>
            </a>
          </li>
        ) : (
          <></>
        )}

        {applicant.events && (
          <>
            <hr className="h-1 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" />

            <p
              className={`flex flex-row gap-2 items-center ${ThinAdminTextStyles.default}`}
            >
              {Constants.EVENT_THRESHOLD_TITLE}
              {isRushThresholdMet(applicant.events) ? (
                <Badge color="success">True</Badge>
              ) : (
                <Badge color="failure">False</Badge>
              )}
            </p>
          </>
        )}
      </ul>
    </Card>
  );
}

enum Constants {
  EVENT_THRESHOLD_TITLE = "Event Threshold:",
  LINKEDIN_BADGE_TITLE = "Website",
  WEBSITE_BADGE_TITLE = "Website",
}
