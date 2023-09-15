"use client"

import React from 'react';


export default function ApplicantPDFViewer() {

  return (
    <div className="h-screen">
      <iframe className="h-full w-full" src="https://whyphi-flask-prod.s3.amazonaws.com/631fea00becc9b3d91177cac/resume/63227d59becc9b3d91177cae_resume" />
    </div>
  );
}