"use client";
import { Card } from 'flowbite-react';

interface ListingCardProps {
    title: string;
    value: string
}

export default function SummaryCard({ title, value }: ListingCardProps) {
    return (
        <>
            <Card className="flex justify-start max-w-sm shadow-none bg-gray-50">
                <h5 className="text-sm font-medium tracking-tight text-gray-700 dark:text-white">
                    {title}
                </h5>
                <p className="font-bold text-2xl">
                    {value}
                </p>
            </Card>
        </>
    );
}