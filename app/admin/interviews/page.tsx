"use client";
import { useEffect, useState } from "react";
import InterviewListingCard from "@/components/admin/interviews/InterviewListingCard";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Card } from "flowbite-react";
import { FaPlus } from "react-icons/fa";

interface InterviewListing {
  _id: string;
  title: string;
  semester: string; // TO-DO: Change this into a reference for a timeframe object?
  active: boolean;
  questions: string[];
  dateCreated: string;
  isVisible: boolean;
  type: 'case' | 'technical' | 'behavioral' | 'other'; 
}

export default function Interviews() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const [interviews, setInterviews] = useState<InterviewListing[]>([]);

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInterviews(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loader />;
  return (
    <main className="container mx-auto px-8">
      <div className="flex flex-row mt-2 mb-4 justify-between">
        <p className="text-4xl font-semibold">Interview Listings</p>
        <div className="flex flex-row space-x-2 hover:bg-violet-200 cursor-pointer items-center px-4 py-2 bg-violet-100 rounded-xl">
          <FaPlus />
          <a href="/admin/interviews/create" className="text-sm">
            Create New Interview
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {interviews.map((listing, index) => (
          <div key={index} className="col-span-1">
            <InterviewListingCard
              listingId={listing._id}
              title={listing.title}
              active={listing.isVisible}
              semester={listing.semester}
              questions={listing.questions}
              dateCreated={listing.dateCreated}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
