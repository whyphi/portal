'use client'
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  major: string;
  gpa: string;
  gradYear: string;
  email: string;
  phone: string;
  linkedin: string;
  resume: File | null;
  image: File | null;
}

export default function Form() {
  const [formData, setFormData] = useState<FormData>({
    gradYear: '',
    firstName: '',
    lastName: '',
    preferredName: '',
    major: '', // Filled in major property
    gpa: '',
    email: '', // Filled in email property
    phone: '', // Filled in phone property
    linkedin: '', // Filled in linkedin property
    resume: null,
    image: null,
  });

  const [colleges, setColleges] = useState({
    CAS: false,
    Pardee: false,
    QST: false,
    COM: false,
    ENG: false,
    CFA: false,
    CDS: false,
    CGS: false,
    Sargent: false,
    SHA: false,
    Wheelock: false,
    Other: false,
  });

  const handleSubmit = async () => { }

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => { }

  const handleCollegeChange = (e: React.FormEvent<HTMLFormElement>) => {
    const { name, checked } = e.target;
    setColleges({
      ...colleges,
      [name]: checked,
    });
  };


  const handleFileChange = () => { }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Preferred Name</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="preferredName"
          placeholder="Preferred Name"
          value={formData.preferredName}
          onChange={(e) => handleChange}
      />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">GPA</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="gpa"
          placeholder="GPA"
          value={formData.gpa}
          onChange={(e) => handleChange}
        />
      </div>
     <label className="block mb-2 text-sm font-medium text-gray-900">College / School</label>
     <fieldset className="grid gap-2 grid-cols-4 mb-6">
      {Object.entries(colleges).map(([college, isChecked]) => (
          <label key={college}>
            <input
              className="mr-2"
              type="checkbox"
              name={college}
              checked={isChecked}
              onChange={(e) => handleCollegeChange}
            />
            {college}
          </label>
        ))}
     </fieldset>
     <div className="flex">
      <label className="block mb-4 text-md font-medium text-gray-900">Upload your personal portrait</label>
      <input className="flex" type="file" id="fileInput" name="fileInput" />
     </div>
     <div className="flex">
      <label className="block mb-4 text-md font-medium text-gray-900">Upload your résumé</label>
      <input type="file" id="fileInput" name="fileInput" />
     </div>
    <button 
      className="ml-auto items-center mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      type="submit" 
    >
      Submit
    </button>
    </form>
  )
}
