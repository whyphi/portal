import React, { useEffect, useState } from 'react';
import './tracker.css';
import CreateSemester from './newsemester';
import SemesterList from './semesterList';

interface Semester {
  id: number;
  semester: string;
  link: string;
}

interface Points {
  Name: string;
  Class: string;
  Status: string;
  TPoints: number;
  Rush: number;
  Chapter: number;
  Fundraising: number;
  Team: number;
  Event: number;
  Variable: number;
}


const fetchSemesterPoints = async (semesterLink: string, setPoints: React.Dispatch<React.SetStateAction<Points[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const response = await fetch(`/spreadsheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ semesterLink }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    setPoints(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};

export default function Accountability(){
  const [semesterList, setSemesterList] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [pointsData, setPointsData] = useState<Points[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openForm = () => {
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const handleSemesterClick = async (semesterLink: string) => {
    setSelectedSemester(semesterLink);
    setPointsData([]);
    setIsLoading(true);
    fetchSemesterPoints(semesterLink, setPointsData, setIsLoading);
  };

return(
  <div id="box-wrap">
    <div id="box">
      <div id="header">
        <div id="semester">
          <ul>
            <li>
              <a href="#">SEMESTER</a>
              <ul>
                {semesterList.map((semester) => (
                  <li key={semester.id} onClick={() => handleSemesterClick(semester.link)}>
                    {semester.semester}
                  </li>
                ))}
                <li>
                  <button onClick={openForm}>New Semester</button>
                  <CreateSemester isOpen={isFormOpen} onClose={closeForm}/>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div id="policylink">
          <a href="https://docs.google.com/document/d/1WKD4-PHkIx_ZTc9rMdRqJJDHi9nvqfBdL9PxgjTU4VY/edit?usp=sharing">Policy</a>
        </div>
      </div>
    </div>
    <div id="box">
      <div id="pointsheet">
      <table>
          <thead>
            <tr>
              <th id="sheetheader">Name</th>
              <th id="sheetheader">Class</th>
              <th id="sheetheader">Status</th>
              <th id="sheetheader">TPoints</th>
              <th id="sheetheader">Rush</th>
              <th id="sheetheader">Chapter</th>
              <th id="sheetheader">Fundraising</th>
              <th id="sheetheader">Team</th>
              <th id="sheetheader">Event</th>
              <th id="sheetheader">Variable</th>
            </tr>
          </thead>
          <tbody>
            {pointsData.map((point, index) => (
              <tr key={index}>
                <td id="sheetdata">{point.Name}</td>
                <td id="sheetdata">{point.Class}</td>
                <td id="sheetdata">{point.Status}</td>
                <td id="sheetdata">{point.TPoints}</td>
                <td id="sheetdata">{point.Rush}</td>
                <td id="sheetdata">{point.Chapter}</td>
                <td id="sheetdata">{point.Fundraising}</td>
                <td id="sheetdata">{point.Team}</td>
                <td id="sheetdata">{point.Event}</td>
                <td id="sheetdata">{point.Variable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}