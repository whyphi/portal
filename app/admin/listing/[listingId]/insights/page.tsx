"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Dashboard, DistributionMetricsState } from "@/types/insights"
import { Applicant } from "@/types/applicant";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { Table, Tabs } from 'flowbite-react';
import SummaryCard from "@/components/admin/listing/insights/SummaryCard";
import { useAuth } from "@/app/contexts/AuthContext";

import { CustomFlowbiteTheme } from "flowbite-react";
import Link from "next/link";
import { selectedApplicantIdKey } from "@/utils/globals";
import { AdminTextStyles } from "@/styles/TextStyles";


export default function Insights({ params }: { params: { listingId: string } }) {
  const router = useRouter();
  const { token } = useAuth();

  // dashboard : object containing data from backend (# applicants, average gpa, #1 major, avg gradYear, avg response length)
  const [dashboard, setDashboard] = useState<Dashboard>({
    applicantCount: null,
    avgGpa: null,
    commonMajor: "",
    commonGradYear: "",
  });
  const [insightsLoading, setInsightsIsLoading] = useState<boolean>(true);

  // distributionMetrics : object containing frequencies of each metric for all applicants
  const [distributionMetrics, setDistributionMetrics] = useState<DistributionMetricsState>({
    colleges: [],
    gpa: [],
    gradYear: [],
    major: [],
    minor: [],
    linkedin: [],
    website: [],
  });
  // fields : list of all fields being used for analytics
  const fields: string[] = ["colleges", "gpa", "gradYear", "major", "minor", "linkedin", "website"]

  // selectedItem : used to track which metric plot pie chart for
  const [selectedItem, setSelectedItem] = useState<string | null>("colleges");

  // matchingApplicants : list of applicants depending on which part of PieChart (if any) has been clicked
  const [matchingApplicants, setMatchingApplicants] = useState<[] | Applicant[]>([]);

  // Parse data whenever applicantData changes
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insights/listing/${params.listingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(([dashboard, distribution]: [Dashboard, DistributionMetricsState]) => {
        setDashboard(dashboard);
        setDistributionMetrics(distribution)
        setInsightsIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data analytics:", error));


  }, [params.listingId, token])



  const handleActiveTab = (tab: number) => {
    const numToItem: { [key: number]: string } = {
      0: "colleges",
      1: "gpa",
      2: "gradYear",
      3: "major",
      4: "minor",
      5: "linkedin",
      6: "website",
    };
    setSelectedItem(numToItem[tab]);
    setMatchingApplicants([]);
  };


  const handlePieClick = (data: any) => {
    // error handling (only if metric/selectedItem is valid)
    if (selectedItem && fields.includes(selectedItem)) {
      // search for correct name for given metric
      distributionMetrics[selectedItem].map((metricObject) => {
        if (data.name == metricObject.name) {
          setMatchingApplicants(metricObject.applicants)
        }
      })
    }
  };

  const renderCell = (applicant: Applicant) => {
    // handle edge cases
    if (!selectedItem) return

    // NOTE: this is not the best practice here (overriding type setting)
    const val = (applicant[selectedItem as keyof Applicant] as string)

    if (selectedItem === "colleges") {
      // case 1: metric is colleges
      let colleges = ""
      Object.entries(applicant.colleges).forEach(([college, status]: [string, boolean]) => {
        if (status) {
          colleges += " " + college
        }
      })
      return <Table.Cell>{colleges}</Table.Cell>
    } else if (["linkedin", "website"].includes(selectedItem)) {
      // case 2: handle url status
      const hasURL = typeof val === 'string' && val !== "" ? (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-500"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {val}
        </a>
      ) : (
        "False"
      );
      return <Table.Cell>{hasURL}</Table.Cell>
    } else {
      // case 3: "gpa", "gradYear", "major", "minor"
      return <Table.Cell>{val}</Table.Cell>
    }
  }

  const handleRowClick = (applicant: Applicant) => {
    localStorage.setItem(selectedApplicantIdKey, applicant.applicantId);
    router.push(`/admin/listing/${params.listingId}`);
  };

  const mapMatchingApplicants = matchingApplicants.map((applicant: Applicant, index: number) => (
    <Table.Row
      className={`bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer`}
      key={index}
      onClick={() => handleRowClick(applicant)}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {applicant.firstName} {applicant.lastName}
      </Table.Cell>
      {renderCell(applicant)}
    </Table.Row>
  ))

  // if applicants data not yet received : produce loading screen
  if (insightsLoading) return (<Loader />)

  return (
    <div>
      <h1 className={AdminTextStyles.title}>Insights</h1>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SummaryCard title="Number of Applicants" value={dashboard.applicantCount} />
        <SummaryCard title="Average GPA" value={dashboard.avgGpa} />
        <SummaryCard title="Most Common Major" value={dashboard.commonMajor} />
        <SummaryCard title="Most Common Grad Year" value={dashboard.commonGradYear} />
      </div>


      <Tabs aria-label="Tabs with underline" onActiveTabChange={(tab) => handleActiveTab(tab)}>
        {fields.map((field, index) => (
          <Tabs.Item color="purple" title={field} key={index} />
        ))}
      </Tabs>

      <div className="flex flex-col items-center w-full">
        <PieChart width={450} height={400}>
          {selectedItem && distributionMetrics[selectedItem].length > 0 ?
            <Pie
              data={distributionMetrics[selectedItem]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={130}
              outerRadius={160}
              fill="#BB9CFF"
              label
              onClick={handlePieClick}
              className="cursor-pointer"
            >
              <Label className={AdminTextStyles.default} position="center">
                {selectedItem}
              </Label>
            </Pie>
            :
            <Loader />
          }
          <Tooltip />
        </PieChart>
      </div>

      {selectedItem &&
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>{selectedItem}</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {mapMatchingApplicants}
          </Table.Body>
        </Table>
      }

    </div>
  )
}