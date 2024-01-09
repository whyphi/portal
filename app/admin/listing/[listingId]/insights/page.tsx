"use client"
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import ApplicantCard from "@/components/admin/listing/ApplicantCard";
import { DistributionMetricsState, Metrics } from "@/types/insights"
import { Applicant } from "@/types/applicant";
import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";


export default function test({ params }: { params: { listingId: string } }) {
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
  const [distributionMetrics, setDistributionMetrics] = useState<DistributionMetricsState>({
    colleges: [],
    gpa: [],
    gradYear: [],
    major: [],
    minor: [],
    linkedin: [],
    website: [],
  });
  const fields : string[] = ["colleges", "gpa", "gradYear", "major", "minor", "linkedin", "website"]
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch listings data from your /listings API endpoint
  useEffect(() => {
    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`)
    .then((response) => response.json())
    .then((data: [Applicant]) => {
      setApplicantData(data)
      setIsLoading(false);
    })
    .catch((error) => console.error("Error fetching applicants:", error));
    
  }, [])
  useEffect(() => {
    try {
      if (applicantData) {
        parseData()
      }
    } catch (error) {
      console.log("error parsing data:", error)
    }
  }, [applicantData])

  console.log(distributionMetrics)
  console.log(distributionMetrics.major[0]?.value)

  // parseData : iterates over list of applicantData and obtains distribution of metrics (colleges, gpa, gradYear, major, minor, linkedin, website)
  const parseData = () => {
    // create temporary copy of distributionMetrics (update after)
    const updatedMetrics = { ...distributionMetrics };

    // map through list of applicants
    applicantData.map((applicant: Applicant) => {
      // iterate through keys of applicant object (only consider valid ones)
      Object.entries(applicant).forEach(([metric, val]: [string, string]) => {
        // valOut : changes to boolean if metric is "linkedin/website" --> otherwise string metric
        let valOut: string | boolean = val

        if (!fields.includes(metric)) {
          // case 1: ignore irrelevant metrics
          return;
          
        } else if (metric == "colleges") {
          // case 2: if colleges -> iterate over list of colleges

          return;

        } else if (["linkedin", "website"].includes(metric)) {
            // case 3: hasUrl -> true or false depending on if user has linkedin/website
            valOut = val.includes("https://www.");
        } 
        // handle all other metric updates
        const foundMetric = updatedMetrics[metric].find(metricObject => metricObject?.name === valOut);
        if (foundMetric) {
          foundMetric.value += 1
        } else {
          const newMetric: Metrics = { name: valOut, value: 1};
          updatedMetrics[metric].push(newMetric);
        }
          
      })
    })
    setDistributionMetrics(updatedMetrics)
  }

  // if applicants data not yet received : produce loading screen
  if (isLoading) return (<Loader />)

  const data02 = [
    {
      name: "Group A",
      value: 2400
    },
    {
      "name": "Group B",
      "value": 4567
    },
    {
      "name": "Group C",
      "value": 1398
    },
  ];
  return (
    <div>
        <PieChart width={730} height={250}>
          {distributionMetrics.major.length > 0 ? 
            <Pie data={distributionMetrics.gradYear} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={100} fill="#82ca9d" label />
            :
            <Loader />
          }
          <Tooltip />
        </PieChart>
    </div>


  )
}