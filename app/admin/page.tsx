'use client'
import { useState } from "react";
import ListingCard from "@/components/admin/ListingCard";


export default function Admin() {

    const cardsData = [
        { title: "Fall 2023", active: true, dateCreated: "09/01/23", applicantCount: 142 },
        { title: "Spring 2023", active: false, dateCreated: "01/13/23", applicantCount: 294 },
        { title: "Fall 2022", active: false, dateCreated: "09/12/22", applicantCount: 23 },
    ];

    return (
        <main className="container mx-auto p-8">
            <div className="grid grid-cols-3 gap-4">
                {cardsData.map((card, index) => (
                    <div key={index} className="col-span-1">
                        <ListingCard title={card.title} active={card.active} dateCreated={card.dateCreated} applicantCount={card.applicantCount}/>
                    </div>
                ))}
            </div>
        </main>
    );
}
