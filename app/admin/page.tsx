'use client'
import { useEffect, useState } from "react";
import ListingCard from "@/components/admin/ListingCard";

interface Listing {
    title: string;
    active: boolean;
    dateCreated: string; // You can use a more specific date type if needed
    // Define other properties as per your API response
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
            <div className="grid grid-cols-3 gap-4">
                {listings.map((listing, index) => (
                    <div key={index} className="col-span-1">
                        <ListingCard title={listing.title} active={true} dateCreated={listing.dateCreated} applicantCount={0} />
                    </div>
                ))}
            </div>
        </main>
    );
}
