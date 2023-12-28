"use client"
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";
import ListingView from "@/components/admin/ListingView";
import AdminLoader from "@/components/AdminLoader";
import { useSession, signIn, signOut } from "next-auth/react";


interface Listing {
  listingId: string;
  title: string;
  active: boolean;
  deadline: string;
  dateCreated: string;
  isVisible: boolean;
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings`)
      .then((response) => response.json())
      .then((data: Listing[]) => {
        setListings(data)
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);

  return (
    <main className="container mx-auto">
      <ListingView/>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing, index) => (
          <div key={index} className="col-span-1">
            <ListingCard
              listingId={listing.listingId}
              title={listing.title}
              active={listing.isVisible}
              deadline={listing.deadline}
              dateCreated={listing.dateCreated}
              applicantCount={0}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
