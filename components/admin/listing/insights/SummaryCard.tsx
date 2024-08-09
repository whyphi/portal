"use client";
import { AdminTextStyles } from '@/styles/TextStyles';
import { Card } from 'flowbite-react';

interface ListingCardProps {
    title: string;
    value: any;
}

export default function SummaryCard({ title, value }: ListingCardProps) {
    return (
        <>
            <Card className="flex justify-start max-w-sm shadow-none bg-gray-50">
                <h5 className={`${AdminTextStyles.subtext} tracking-tight`}>
                    {title}
                </h5>
                <p className={AdminTextStyles.subtitle}>
                    {value}
                </p>
            </Card>
        </>
    );
}