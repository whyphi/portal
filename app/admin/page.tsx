"use client"
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";
import Loader from "@/components/Loader";
import { useAuth } from "../contexts/AuthContext";
import { Listing } from "@/types/listing";



export default function Admin() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Listing[]) => {
        setListings(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, [token]);


  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing, index) => (
          <div key={index} className="col-span-1">
            <ListingCard
              listingId={listing.id}
              title={listing.title}
              active={listing.is_visible}
              isEncrypted={listing.is_encrypted}
              deadline={listing.deadline}
              dateCreated={listing.date_created}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
