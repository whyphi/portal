"use client"
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";

interface Listing {
  listingId: string;
  title: string;
  active: boolean;
  deadline: string;
  dateCreated: string;
}

export default function Admin() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Fetch listings data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings`)
      .then((response) => response.json())
      .then((data: Listing[]) => setListings(data))
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);

  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((listing, index) => (
          <div key={index} className="col-span-1">
            <ListingCard
              listingId={listing.listingId}
              title={listing.title}
              active={true}
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
