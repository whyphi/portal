"use client";
import { Applicant, EventsAttended } from "@/types/applicant";
import { Badge, Tabs, Table, Dropdown } from "flowbite-react";
import { HiMenuAlt1, HiDocumentText, HiUserGroup } from "react-icons/hi";
import { IoPeople } from "react-icons/io5";
import ResponseCard from "@/components/admin/listing/ResponseCard";
import InterviewCard from "@/components/admin/listing/InterviewCard";
import ApplicantInfoCard from "@/components/admin/listing/ApplicantInfoCard";
import ApplicantPDFViewer from "@/components/admin/listing/ApplicantPDFViewer";

interface ApplicantPageProps {
  applicant: Applicant;
}

export default function ApplicantPage({ applicant }: ApplicantPageProps) {

  const renderResponses = () => {
    return (
      applicant?.responses.length === 0 ? (
        <p>None</p>
      ) : (
        <div className="">
          {applicant?.responses.map((response, index) => (
            <ResponseCard
              key={index}
              question={response.question}
              answer={response.response}
            />
          ))}
        </div>
      )
    );
  };

  const renderEventsAttended = (eventsAttended: EventsAttended) => {
    const eventNames = Object.keys(eventsAttended).sort();

    return (
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Event Name</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {eventNames.map((eventName) => (
              <Table.Row key={eventName} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {eventName}
                </Table.Cell>
                <Table.Cell className="flex">
                  {eventsAttended[eventName] ? (
                    <Badge className="" color="success">
                      Attended
                    </Badge>
                  ) : (
                    <Badge color="failure">Not Attended</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  };

  const renderInterviews = () => {
    const mockInterviewResponses = [
      {
        type: "Behavioral",
        question: "Tell us about yourself. What are you passionate about/what motivates you?",
        answer: "sit amet volutpat consequat mauris nunc",
        notes: "applicant did a good job of explaining their passions and motivations",
        score: 3,
      },
      {
        type: "Behavioral",
        question:
          "Describe a situation where you had to overcome a difficult challenge at work or in a project. How did you handle it?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        notes: "candidate demonstrated resilience and problem-solving skills",
        score: 3,
      },
      {
        type: "Technical",
        question: "How many piano tuners are there in New York City?",
        answer: "Fusce vehicula justo ut urna vestibulum placerat.",
        notes: "interviewee demonstrated analytical thinking and estimation skills",
        score: 3,
      },
      {
        type: "Technical",
        question: "What is the next number in this sequence: 1, 4, 9, 16, 25, ...?",
        answer: "Maecenas commodo velit nec purus gravida malesuada.",
        notes: "applicant showed logical reasoning and pattern recognition abilities",
        score: 3,
      },
      {
        type: "Case",
        question: "How would you approach increasing market share for a declining product?",
        answer: "Nullam vitae justo eget purus viverra accumsan.",
        notes: "interviewee proposed innovative strategies and demonstrated analytical thinking",
        score: 3,
      },
      {
        type: "Case",
        question:
          "Discuss a recent business news article that caught your attention. How does it relate to our industry?",
        answer: "Integer non lectus sit amet est commodo ultricies.",
        notes: "candidate displayed a good understanding of industry trends and their implications",
        score: 3,
      },
    ];

    const filteredMockInterviewResponses = mockInterviewResponses?.filter((response) => {
      return response.type === interviewTypeSelected || interviewTypeSelected === "All";
    });

    const interviewResults = [
      {
        type: "Behavioral",
        score: 2.5,
      },
      {
        type: "Technical",
        score: 2.5,
      },
      {
        type: "Case",
        score: 4,
      },
    ];
    return mockInterviewResponses?.length === 0 ? (
      <p>None</p>
    ) : (
      <div className="justify-center">
        <div className="border-2 w-full inline-block p-2 rounded my-4 mx-auto border-slate-500">
          {/* <p className="font-semibold text-xl">Interview Summary</p> */}
          <div className="flex flex-row justify-between items-center">
            {interviewResults?.map((response, index) => (
              <div className="text-center px-5 flex flex-col">
                <p>{response.type}:</p>
                <p className="text-4xl font-semibold">{response.score}</p>
              </div>
            ))}
          </div>
        </div>
        <Dropdown label="Filter Interview" placement="bottom" size="sm">
          <Dropdown.Item onClick={() => setInterviewTypeSelected("All")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setInterviewTypeSelected("Behavioral")}>
            Behavioral
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setInterviewTypeSelected("Technical")}>
            Technical
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setInterviewTypeSelected("Case")}>Case</Dropdown.Item>
        </Dropdown>
        <div className="pt-4">
          {filteredMockInterviewResponses?.map((response, index) => (
            <InterviewCard
              key={index}
              type={response.type}
              question={response.question}
              answer={response.answer}
              notes={response.notes}
              score={response.score}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-wrap">
      {/* Left component (ApplicantInfoCard) */}
      <div className="w-full lg:pr-6 lg:w-1/3 overflow-auto lg:sticky top-0 lg:h-screen">
        {applicant && <ApplicantInfoCard applicant={applicant} />}
      </div>

      {/* Right component (Tabs and content) */}
      <div className="w-full lg:w-2/3 overflow-auto lg:pl-6">
<<<<<<< HEAD:app/admin/listing/[listingId]/[applicantId]/page.tsx
        <Tabs.Group className="" aria-label="Tabs with underline" style="underline">
          <Tabs.Item icon={HiMenuAlt1} title="Responses">
            {renderResponses()}
          </Tabs.Item>
          <Tabs.Item icon={HiDocumentText} title="Resume">
            {applicantData && applicantData.resume ? (
              <ApplicantPDFViewer resumeLink={applicantData.resume} />
=======
        <Tabs
          className=""
          aria-label="Tabs with underline"
          style="underline"
        >

          <Tabs.Item
            icon={HiMenuAlt1}
            title="Responses"
          >
            {renderResponses()}
          </Tabs.Item>
          <Tabs.Item
            icon={HiDocumentText}
            title="Resume"
          >
            {applicant && applicant.resume ? (
              <ApplicantPDFViewer resumeLink={applicant.resume} />
>>>>>>> dev/v1.0:components/admin/listing/ApplicantPage.tsx
            ) : (
              <p>No resume available.</p>
            )}
          </Tabs.Item>
<<<<<<< HEAD:app/admin/listing/[listingId]/[applicantId]/page.tsx
          {applicantData?.events ? (
            <Tabs.Item icon={HiUserGroup} title="Events Attended">
              {renderEventsAttended(applicantData.events)}
            </Tabs.Item>
          ) : (
            ""
          )}
          <Tabs.Item icon={IoPeople} title="Interviews">
            {renderInterviews()}
          </Tabs.Item>
        </Tabs.Group>
=======
          {applicant?.events ? (<Tabs.Item
            icon={HiUserGroup}
            title="Events Attended"
          >
            {renderEventsAttended(applicant.events)}
          </Tabs.Item>) : ("")}

        </Tabs>
>>>>>>> dev/v1.0:components/admin/listing/ApplicantPage.tsx
      </div>
    </div>
  );
}
