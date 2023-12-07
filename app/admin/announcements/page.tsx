"use client"
import React, { useState } from "react";
import { Card } from 'flowbite-react';

export default function Announcements() {

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
    content: "font-normal text-gray-700 dark:text-gray-400 whitespace-pre-line", // Add this style
  };

  var dummyAnnouncements = [
    {
      title: "Title of the Announcement Post 1",
      date: "November 6, 2023",
      content: `
      Hi everyone, 

      1. PCT Talks will happen during chapter this week!

      2. Brian Zhuo will host a Retirement Planning Workshop next Thursday during next week's chapter (11/14). This workshop is a continuation of the previous Personal Finance Workshop where you will learn more about ways you can set aside money for retirement accounts and emergency funds (and more)!
      This workshop is extremely helpful especially if you are entering the workforce soon! As future working professionals, finance knowledge is important and I expect to have good attendance next Thursday.
      After the workshop we will be having Final Delibs.

      !! PLEASE COME AND BE RESPECTFUL OF OUR HOST TIME AND EFFORT!! THANK YOU.

      On a side note: If you have any feedback about the current way of running chapter, please let me know and I'll work on improving chapter's quality.`
    },
    {
      title: "Title of the Announcement Post 2",
      date: "October 16, 2023",
      content: `
      Hi everyone,

      We will have a Photoshop Workshop this Thursday during chapter time (7-8pm) @ CAS B20 hosted by our President Danielle!! You will learn the basics about using Adobe Photoshop to create and submit a Halloween themed design for your attendance.

      Please have Adobe Photoshop downloaded on your computer before coming to chapter this Thursday. You can find the instructions here: https://www.bu.edu/.../adobe.../installation-instructions/
      
      If you have any questions please reach out to me or Dani. Thank you so much and hope to see you all on Thursday!!
    `
    }
      
  ];

  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>Announcements</h1>
      {dummyAnnouncements.map((announcement, index) => (
        <Card key={index} href="#" className="max-w mb-4">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {announcement.title}
          </h5>
          <p className="text-xs">{announcement.date}</p>
          <p className={textStyles.content}>
            {announcement.content}
          </p>
        </Card>
      ))}
    </div>
  );
}
