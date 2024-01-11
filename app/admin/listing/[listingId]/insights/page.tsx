"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { DistributionMetricsState, Metrics, Colleges } from "@/types/insights"
import { Applicant } from "@/types/applicant";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Label } from "recharts";
import { Dropdown, Table } from 'flowbite-react';


export default function Insights({ params }: { params: { listingId: string } }) {
  const router = useRouter();
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
  const fields : string[] = ["colleges", "gpa", "gradYear", "major", "minor", "linkedin", "website"]
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // selectedItem : used to track which metric plot pie chart for
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
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
                const newCollege: Metrics = { name: college, value: 1, applicants: [applicant]};
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
          const newMetric: Metrics = { name: typeof val === 'string' && val, value: 1, applicants: [applicant]};
          updatedMetrics[metric].push(newMetric);
        }
        
      })
    })
    setDistributionMetrics(updatedMetrics)
  }
  
  // handleDropdownChange : updates title of dropdown...
  const handleDropdownChange = (selectedItem: string) => {
    setSelectedItem(selectedItem);
    setMatchingApplicants([])
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

  // if applicants data not yet received : produce loading screen
  if (isLoading) return (<Loader />)

  return (
    <div>
      <div className="flex flex-col">
        {/* COLUMN 1: vertical column title/dropdown + pie */}
        <div className="">
          {/* horizontal column : title + dropdown */}
          <div className="flex items-center mb-4 gap-4">
            <h1 className="text-2xl font-bold">Insights</h1>
            <Dropdown 
              label={selectedItem || 'Select a metric'}
              style={{
                background: 'linear-gradient(to right, #8e5ef9, #6d2bd9)',
                color: 'white',
              }}
            >
              {fields.map((field, index) => (
                <Dropdown.Item key={index} onClick={() => handleDropdownChange(field)}>
                  {field}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
          
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

        {/* COLUMN 2 */}
        { selectedItem &&
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
    </div>
  )
}