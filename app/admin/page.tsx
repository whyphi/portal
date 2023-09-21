"use client"
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";
import AdminLoader from "@/components/AdminLoader";
import { useSession, signIn, signOut } from "next-auth/react";


interface Listing {
  listingId: string;
  title: string;
  active: boolean;
  deadline: string;
  dateCreated: string;
}

export default function Admin() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (session === null) {
      signIn("google")
    } else {
      if (session && session?.user) {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings`)
          .then((response) => response.json())
          .then((data: Listing[]) => {
            setListings(data)
            setIsLoading(false);
          })
          .catch((error) => console.error("Error fetching listings:", error));
      }
    }
  }, [session]);





  if (isLoading) return <AdminLoader />

  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
