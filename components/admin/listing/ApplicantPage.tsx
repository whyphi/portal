"use client";
import { Applicant, EventsAttended } from "@/types/applicant";
import { Badge, Tabs, Table } from 'flowbite-react';
import { HiMenuAlt1, HiDocumentText, HiUserGroup, HiVideoCamera } from 'react-icons/hi';
import ResponseCard from "@/components/admin/listing/ResponseCard";
import ApplicantInfoCard from "@/components/admin/listing/ApplicantInfoCard";
import ApplicantPDFViewer from "@/components/admin/listing/ApplicantPDFViewer";
import { AdminTextStyles } from "@/styles/TextStyles";

interface ApplicantPageProps {
  applicant: Applicant;
}

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper function to check if URL is a Google Drive link
const isGoogleDriveLink = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Helper function to convert Google Drive URL to embeddable format
const convertGoogleDriveToEmbed = (url: string): string | null => {
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return null;
};

// Helper function to check if a string is a video URL (YouTube or Google Drive)
const isVideoUrl = (text: string): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  return (
    trimmed.includes('youtube.com') ||
    trimmed.includes('youtu.be') ||
    trimmed.includes('drive.google.com')
  );
};

// Render a video response with embedding
const renderVideoResponse = (url: string) => {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return (
      <div className="aspect-video w-full max-w-3xl">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video Response"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  } else if (isGoogleDriveLink(url)) {
    const embedUrl = convertGoogleDriveToEmbed(url);
    if (embedUrl) {
      return (
        <div className="space-y-2">
          <div className="aspect-video w-full max-w-3xl">
            <iframe
              className="w-full h-full rounded-lg"
              src={embedUrl}
              title="Video Response"
              allow="autoplay"
              allowFullScreen
            />
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 underline"
          >
            Open in Google Drive
          </a>
        </div>
      );
    } else {
      // Fallback if we can't extract file ID
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <HiVideoCamera className="w-5 h-5" />
          Open Video in Google Drive
        </a>
      );
    }
  } else {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 underline break-all"
      >
        {url}
      </a>
    );
  }
};

export default function ApplicantPage({ applicant }: ApplicantPageProps) {

  const renderResponses = () => {
    return (
      applicant.responses ? (
        <div>
          {applicant.responses.map((response, index) => {
            // Check if this response is a video URL (either by URL detection or content)
            if (isVideoUrl(response.response)) {
              return (
                <div key={index} className={`flex flex-col max-w-3xl border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4`}>
                  <div className="p-4 flex flex-row gap-2 items-center rounded-t-lg bg-slate-50 dark:bg-slate-600">
                    <Badge color="purple">Question</Badge>
                    <h5 className={AdminTextStyles.default}>{response.question}</h5>
                  </div>
                  <div className="p-4">
                    {renderVideoResponse(response.response)}
                  </div>
                </div>
              );
            }
            // Regular text response
            return (
              <ResponseCard
                key={index}
                question={response.question}
                answer={response.response}
              />
            );
          })}
        </div>
      ) : (
        <p className={AdminTextStyles.default}>None</p>
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
              <Table.Row key={eventName} className="dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {eventName}
                </Table.Cell>
                <Table.Cell className="flex">
                  {
                    eventsAttended[eventName] ?
                      (<Badge className="" color="success">Attended</Badge>) :
                      (<Badge color="failure">Not Attended</Badge>)
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  // if (isLoading) return <Loader />


  return (
    <div className="flex flex-wrap">
      {/* Left component (ApplicantInfoCard) */}
      <div className="w-full lg:pr-6 lg:w-1/3 overflow-auto lg:sticky top-0 lg:h-screen">
        {applicant && <ApplicantInfoCard applicant={applicant} />}
      </div>

      {/* Right component (Tabs and content) */}
      <div className="w-full lg:w-2/3 overflow-auto lg:pl-6">
        <Tabs
          className=""
          aria-label="Tabs with underline"
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
            ) : (
              <p>No resume available.</p>
            )}
          </Tabs.Item>
          {applicant?.events ? (<Tabs.Item
            icon={HiUserGroup}
            title="Events Attended"
          >
            {renderEventsAttended(applicant.events)}
          </Tabs.Item>) : ("")}

        </Tabs>
      </div>
    </div>
  );
}
