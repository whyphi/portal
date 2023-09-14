"use client";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listingId: string;
  title: string;
  active: boolean;
  dateCreated: string;
  deadline: string;
  applicantCount: number;
}




export default function ListingCard({ listingId, title, active, deadline, dateCreated, applicantCount }: ListingCardProps) {
  const router = useRouter();

  const renderIndicator = (active: boolean) => {
    if (active) {
      return (
        <div className="flex flex-row items-center mb-2">
          <span className="flex w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Active</p>
        </div>
      )
    } else {
      return (
        <div className="flex flex-row items-center mb-2">
          <span className="flex w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <p className="text-sm font-medium">Inactive</p>
        </div>
      )
    }
  }

  const renderDateCreatedBadge = (dateCreated: string) => {
    // Parse the input date string
    const createdDate = new Date(dateCreated);

    // Check if the date is valid
    if (isNaN(createdDate.getTime())) {
      return null; // Return null or handle the invalid date as needed
    }

    // Get the year, month, and day components
    const year = createdDate.getFullYear();
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');
    const day = String(createdDate.getDate()).padStart(2, '0');

    // Format the date as "yyyy-mm-dd"
    const formattedDate = `${year}. ${month}. ${day}`;

    return (
      <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
        Created: {formattedDate}
      </span>
    );
  };

  const renderDeadline = (deadline: string) => {
    // Parse the input deadline string
    const deadlineDate = new Date(deadline);

    // Check if the date is valid
    if (isNaN(deadlineDate.getTime())) {
      return null; // Return null or handle the invalid date as needed
    }

    // Get the year, month, day, hours, minutes, and seconds components
    const year = deadlineDate.getFullYear();
    const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
    const day = String(deadlineDate.getDate()).padStart(2, '0');
    const hours = String(deadlineDate.getHours()).padStart(2, '0');
    const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
    const seconds = String(deadlineDate.getSeconds()).padStart(2, '0');

    // Format the date as "yyyy. dd. mm, hh:mm:ss"
    const formattedDeadline = `${year}. ${month}. ${day}, ${hours}:${minutes}:${seconds}`;

    return (
      <div className="flex flex-row items-center">
        <svg className="w-2 h-2 mr-1 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-xs text-gray-500">
          {formattedDeadline}
        </p>
      </div>
    );
  };


  const handleListingCardClick = () => {
    // Navigate to the listingId URL when the card is clicked
    router.push(`/admin/listing/${listingId}`);
  };


  return (

    <div onClick={handleListingCardClick} className="flex flex-col cursor-pointer max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div>
        {renderIndicator(active)}
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <div className="mt-1">
          {renderDateCreatedBadge(dateCreated)}
        </div>
      </div>
      <div className="mt-4">
        <hr className="h-px mb-2 mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
        {renderDeadline(deadline)}
        {/* 
        <p className="text-sm font-medium">
          Total {applicantCount}
        </p> */}
      </div>

    </div>

  );

}