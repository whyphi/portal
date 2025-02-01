"use client"
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import { Card } from 'flowbite-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminTextStyles } from "@/styles/TextStyles";
import { getAllEventData, calculateMemberParticipationRate, getNumRushApplicantsCount, getMemberCollegeDistributionData } from "@/utils/admin/analyticsOverviewFunctions";


import {
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Area,
  BarChart,
  LabelList,
  PieChart,
  Pie
} from "recharts";

export default function Analytics() {
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<any[]>([]);

  const [isMemberParticipationRateLoading, setIsMemberParticipationRateLoading] = useState<boolean>(true);
  const [memberParticipationRateData, setMemberParticipationRateData] = useState<any[]>([]);

  const [isRushApplicantCountLoading, setIsRushApplicantCountLoading] = useState<boolean>(true);
  const [rushApplicantCountData, setRushApplicantCountData] = useState<any[]>([]);

  const [isMemberCollegeDistributionLoading, setIsMemberCollegeDistributionLoading] = useState<boolean>(true);
  const [memberCollegeDistributionData, setMemberCollegeDistributionData] = useState<any[]>([]);

  const ACTIVE_MEMBER_COUNT = 89;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEventData(token);
        setEventData(data);
        const participationRateData = calculateMemberParticipationRate(data, ACTIVE_MEMBER_COUNT);
        setMemberParticipationRateData(participationRateData);
        setIsMemberParticipationRateLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    setIsLoading(false);
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNumRushApplicantsCount(token);
      setRushApplicantCountData(data);
      setIsRushApplicantCountLoading(false);
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMemberCollegeDistributionData(token);
      setMemberCollegeDistributionData(data);
      setIsMemberCollegeDistributionLoading(false);
    }
    fetchData();
  }, [token]);

  if (isLoading) return (<Loader />);

  const innerCardLoader = () => {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    )
  }

  const memberEventParticipationRateGraph = () => {

    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
      if (active && payload && payload.length) {
        return (
          <Card>
            <p className="text-sm font-semibold">{`${label}`}</p>
            <p className="text-xs">{`Participation %: ${payload[0].value*100}%`}</p>
            <p className="text-xs">{`Avg Participation %: ${payload[1].value*100}%`}</p>
          </Card>
        );
      }

      return null;
    };

    return (
      <div>
        <h2>Member Event Participation Rate Over Time</h2>
        <p className="text-xs text-gray-500 mb-4">Note: Events with a participation rate of less than 5% have been removed as outliers to prevent fluctuations in the average attendance rate.</p>
        <ResponsiveContainer width="100%" height={250}>
          {isMemberParticipationRateLoading ? (
            innerCardLoader()
          ) : (
            <ComposedChart data={memberParticipationRateData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="participationRate" barSize={20} fill="#413ea0" />
              <Area type="monotone" dataKey="avgParticipationRate" fill="#8884d8" stroke="#8884d8" />
            </ComposedChart>
          )}

        </ResponsiveContainer>
      </div>
    )
  }

  const rushApplicantCountGraph = () => {
    return (
      <div>
        <h2 className="mb-4">Number of Applications Submitted for Rush</h2>

        <ResponsiveContainer width="100%" height={300}>
          {isRushApplicantCountLoading ? (
            innerCardLoader()
          ) : (
            <BarChart data={rushApplicantCountData} layout="vertical">
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="title" hide={true} />
              <Tooltip />
              <Bar dataKey="applicantCount" barSize={40} fill="#413ea0" radius={[5, 5, 5, 5]}>
                {/* Built-in label for centering with padding */}
                <LabelList dataKey="title" position="insideLeft" fill="#FFFFFF" style={{ fontSize: 13, fontWeight: '600', marginLeft: 20 }} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }

  const memberCollegeDistributionGraph = () => {
    return (
      <div>
        <h2>College Distribution Pie Chart</h2>
        <p className="text-xs text-gray-500 mb-4">Note: This pie chart displays data only for members who have registered with WhyPhi.</p>

        <ResponsiveContainer width="100%" height={300}>
          {isMemberCollegeDistributionLoading ? (
            innerCardLoader()
          ) : (
            <PieChart>
              <Pie data={memberCollegeDistributionData} dataKey="count" nameKey="college" cx="50%" cy="50%" fill="#8884d8" label={true}>
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      <h1 className={AdminTextStyles.subtitle}>Analytics Overview</h1>
      <Card className="mb-4">
        {memberEventParticipationRateGraph()}
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          {rushApplicantCountGraph()}
        </Card>
        <Card>
          {memberCollegeDistributionGraph()}
        </Card>
      </div>

    </div>
  )
}
