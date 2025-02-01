"use client"
import React, { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import { Applicant } from "@/types/applicant";
import { Tabs, TabsRef, Table, Button, Pagination, Card } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminTextStyles } from "@/styles/TextStyles";
import { getAllEventData, calculateMemberParticipationRate } from "@/utils/admin/memberAnalytics";


import { ComposedChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Area } from "recharts";

export default function Analytics() {
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<any[]>([]);
  const [memberParticipationRateData, setMemberParticipationRateData] = useState<any[]>([]);
  const ACTIVE_MEMBER_COUNT = 89;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEventData(token);
        setEventData(data);
        const participationRateData = calculateMemberParticipationRate(data, ACTIVE_MEMBER_COUNT);
        setMemberParticipationRateData(participationRateData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) return (<Loader />);


  return (
    <div>
      <h1 className={AdminTextStyles.subtitle}>Analytics Overview</h1>
      <Card className="mb-4">
        <h2>Member Event Participation Rate Over Time</h2>
        <p className="text-xs text-gray-500 mb-4">Note: Events with a participation rate of less than 0.05% have been removed as outliers to prevent fluctuations in the average attendance rate.</p>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart
            data={memberParticipationRateData}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="participationRate" barSize={20} fill="#413ea0" />
            <Area type="monotone" dataKey="avgParticipationRate" fill="#8884d8" stroke="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

    </div>
  )
}
