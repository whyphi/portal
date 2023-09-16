import React from 'react';

interface ApplicantPDFViewerProps {
  resumeLink: string; // Define a prop called 'resumeLink' of type string
}

export default function ApplicantPDFViewer(props: ApplicantPDFViewerProps) {
  return (
    <div className="h-screen">
      <iframe className="h-full w-full" src={props.resumeLink} />
    </div>
  );
}
