"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Dashboard, DistributionMetricsState, Metrics, Colleges } from "@/types/insights"
import { Applicant } from "@/types/applicant";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Label } from "recharts";
import { Dropdown, Table, Tabs } from 'flowbite-react';
import SummaryCard from "@/components/admin/listing/insights/SummaryCard";

import { FlowbiteTabTheme } from "flowbite-react";


export default function Insights({ params }: { params: { listingId: string } }) {
  const router = useRouter();
  // dashboard : object containing data from backend (# applicants, average gpa, #1 major, avg gradYear, avg response length)
  const [dashboard, setDashboard] = useState<Dashboard>({
    applicantCount: null,
    avgGpa: null,
    commonMajor: "",
    avgGradYear: "",
  });

  // applicantData : list of applicants
  const [applicantData, setApplicantData] = useState<[] | [Applicant]>([]);
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // selectedItem : used to track which metric plot pie chart for
  const [selectedItem, setSelectedItem] = useState<string | null>("colleges");

  // matchingApplicants : list of applicants depending on which part of PieChart (if any) has been clicked
  const [matchingApplicants, setMatchingApplicants] = useState<[] | Applicant[]>([]);

  console.log(matchingApplicants)

  // useRef to track whether parseData has been called
  const parseDataCalled = useRef(false);


  // Fetch listings data from your /listings API endpoint
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applicants/${params.listingId}`)
      .then((response) => response.json())
      .then((data: [Applicant]) => {
        setApplicantData(data)
        setIsLoading(false);
        // parseData()
      })
      .catch((error) => console.error("Error fetching applicants:", error));

  }, [])

  // Parse data whenever applicantData changes
  useEffect(() => {
    try {
      // only run parseData once per refresh (useRef ensures this)
      if (applicantData.length > 0 && !parseDataCalled.current) {
        parseData();
        parseDataCalled.current = true; // Set the flag after parsing data
      }
    } catch (error) {
      console.log("error parsing data:", error);
    }
  }, [applicantData]);


  // parseData : iterates over list of applicantData and obtains distribution of metrics (colleges, gpa, gradYear, major, minor, linkedin, website)
  const parseData = () => {

    // create temporary copy of distributionMetrics (update after)
    const updatedMetrics = { ...distributionMetrics };

    // Calculate Summary Metrics

    const getSummaryMetrics = (applicants: Applicant[]) => {
      console.log("Getting summary metrics");

      // Check if there are applicants
      if (applicants.length === 0) {
        console.log("No applicants to analyze");
        return;
      }

      // Calculate average GPA
      const validGpas = applicants.filter(applicant => !isNaN(parseFloat(applicant.gpa))).map(applicant => parseFloat(applicant.gpa));
      var averageGpa = 0.00;
      if (validGpas.length > 0) {
        const totalGpa = validGpas.reduce((sum, gpa) => sum + gpa, 0);
        averageGpa = totalGpa / validGpas.length;
      } else {
        console.log("No valid GPAs to calculate average");
      }

      // Calculate the most common major
      const majorCounts = applicants.reduce((counts: any, applicant) => {
        const major = applicant.major.trim(); // Trim to handle whitespace variations
        counts[major] = (counts[major] || 0) + 1;
        return counts;
      }, {});

      const mostCommonMajor = Object.keys(majorCounts).reduce((a, b) => (majorCounts[a] > majorCounts[b] ? a : b));

      // Calculate the most common graduation year
      const gradYearCounts = applicants.reduce((counts: any, applicant) => {
        const gradYear = applicant.gradYear;
        counts[gradYear] = (counts[gradYear] || 0) + 1;
        return counts;
      }, {});

      const mostCommonGradYear = Object.keys(gradYearCounts).reduce((a, b) => (gradYearCounts[a] > gradYearCounts[b] ? a : b));

      setDashboard(prevState => ({
        ...prevState,
        applicantCount: applicants.length,
        avgGpa: averageGpa.toFixed(3),
        commonMajor: mostCommonMajor,
        avgGradYear: mostCommonGradYear,
        // Assign other calculated values here (commonMajor, avgGradYear)
      }));
    };

    getSummaryMetrics(applicantData);

    // map through list of applicants
    applicantData.map((applicant: Applicant) => {
      // iterate through keys of applicant object (only consider valid ones)
      Object.entries(applicant).forEach(([metric, val]: [string, string | Colleges]) => {
        // valOut : changes to boolean if metric is "linkedin/website" --> otherwise string metric

        if (!fields.includes(metric)) {
          // case 1: ignore irrelevant metrics
          return;

        } else if (metric == "colleges") {
          // case 2: if colleges -> iterate over object of colleges
          Object.entries(val).forEach(([college, status]: [string, boolean]) => {
            // only consider `true` colleges
            if (status) {
              // search for college in updatedMetrics object
              const foundCollege = updatedMetrics[metric].find(collegeObject => collegeObject?.name === college);
              if (foundCollege) {
                foundCollege.value += 1
                foundCollege.applicants.push(applicant)
              } else {
                const newCollege: Metrics = { name: college, value: 1, applicants: [applicant] };
                updatedMetrics[metric].push(newCollege);
              }
            }
          })
          return;

        } else if (["linkedin", "website"].includes(metric)) {
          // case 3: hasUrl -> true or false depending on if user has linkedin/website
          val = typeof val === 'string' && val.includes("https://www.") ? "True" : "False";

        } else if (val == "") {
          // case 4: val is empty string (missing value)
          val = "None"
        }

        // handle remaining metric updates
        const foundMetric = updatedMetrics[metric].find(metricObject => metricObject?.name === val);

        if (foundMetric) {
          foundMetric.value += 1
          foundMetric.applicants.push(applicant)
        } else {
          const newMetric: Metrics = { name: typeof val === 'string' && val, value: 1, applicants: [applicant] };
          updatedMetrics[metric].push(newMetric);
        }

      })
    })
    setDistributionMetrics(updatedMetrics)
  }

  // handleDropdownChange : updates title of dropdown...
  const handleDropdownChange = (selectedItem: string) => {
    console.log(selectedItem);
    setSelectedItem(selectedItem);
    setMatchingApplicants([])
  };
  // handleDropdownChange : updates title of dropdown...
  const numToItem: { [key: number]: string } = {
    0: "colleges",
    1: "gpa",
    2: "gradYear",
    3: "major",
    4: "minor",
    5: "linkedin",
    6: "website",
  };

  const handleActiveTab = (tab: number) => {
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
      const hasURL = typeof val === 'string' && val.includes("https://www.") ? (
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

  const mapMatchingApplicants = matchingApplicants.map((applicant: Applicant, index: number) => (
    <Table.Row
      key={index}
      className={`bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer`}
      onClick={() => router.push(`/admin/listing/${applicant.listingId}/${applicant.applicantId}`)}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {applicant.firstName} {applicant.lastName}
      </Table.Cell>
      {renderCell(applicant)}
    </Table.Row>
  ))

  const customTabTheme: FlowbiteTabTheme = {
    "base": "flex flex-col gap-2",
    "tablist": {
      "base": "flex text-center",
      "styles": {
        "default": "flex-wrap border-b border-gray-200 dark:border-gray-700",
        "underline": "flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700",
        "pills": "flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 space-x-2",
        "fullWidth": "w-full text-sm font-medium divide-x divide-gray-200 shadow grid grid-flow-col dark:divide-gray-700 dark:text-gray-400 rounded-none"
      },
      "tabitem": {
        "base": "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:ring-4 focus:ring-purple-300 focus:outline-none",
        "styles": {
          "default": {
            "base": "rounded-t-lg",
            "active": {
              "on": "bg-gray-100 text-purple-600 dark:bg-gray-800 dark:text-purple-500",
              "off": "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300"
            }
          },
          "underline": {
            "base": "rounded-t-lg",
            "active": {
              "on": "text-purple-600 rounded-t-lg border-b-2 border-purple-600 active dark:text-purple-500 dark:border-purple-500",
              "off": "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            }
          },
          "pills": {
            "base": "",
            "active": {
              "on": "rounded-lg bg-purple-500 text-white",
              "off": "rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
            }
          },
          "fullWidth": {
            "base": "ml-0 first:ml-0 w-full rounded-none flex",
            "active": {
              "on": "p-4 text-gray-900 bg-gray-100 active dark:bg-gray-700 dark:text-white rounded-none",
              "off": "bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-none"
            }
          }
        },
        "icon": "mr-2 h-5 w-5"
      }
    },
    "tabpanel": "py-3"
  }

  // if applicants data not yet received : produce loading screen
  if (isLoading) return (<Loader />)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Insights</h1>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SummaryCard title="Number of Applicants" value={dashboard.applicantCount} />
        <SummaryCard title="Average GPA" value={dashboard.avgGpa} />
        <SummaryCard title="Most Common Major" value={dashboard.commonMajor} />
        <SummaryCard title="Most Common Grad Year" value={dashboard.avgGradYear} />
      </div>


      <Tabs.Group style="pills" theme={customTabTheme} aria-label="Tabs with underline" onActiveTabChange={(tab) => handleActiveTab(tab)}>
        {fields.map((field, index) => (
          <Tabs.Item color="purple" title={field} key={index} />
        ))}
      </Tabs.Group>

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
              <Label position="center" >
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