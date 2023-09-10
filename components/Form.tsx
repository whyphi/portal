'use client'
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  major: string;
  minor: string;
  gpa: string;
  gradYear: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  resume: File | null;
  image: File | null;
  colleges: {
    CAS: boolean;
    Pardee: boolean;
    QST: boolean;
    COM: boolean;
    ENG: boolean;
    CFA: boolean;
    CDS: boolean;
    CGS: boolean;
    Sargent: boolean;
    SHA: boolean;
    Wheelock: boolean;
    Other: boolean;
  };
}

const initialValues: FormData = {
  gradYear: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  major: '',
  minor: '',
  gpa: '',
  email: '',
  phone: '',
  linkedin: '',
  website: '',
  resume: null,
  image: null,
  colleges: {
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
  },
};

export default function Form() {
  const [formData, setFormData] = useState<FormData>(initialValues);

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

  const handleSubmit = async () => {
    console.log(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      colleges: {
        ...prevData.colleges,
        [name]: checked,
      },
    }));
  };

  const renderInput = (
    id: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = false
  ) => (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id={id}
        type={type}
        placeholder={label}
        value={formData[id]}
        onChange={handleChange}
        required={required}
      />
    </div>
  );


  const handleFileChange = () => { }

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 text-purple-800",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400"
  }

  return (

    <form onSubmit={handleSubmit} className="flex flex-col">
      <div>
        <h1 className={textStyles.title}>PCT Fall 2023 Application</h1>
        {/* <h3 className={textStyles.subtitle}>To promote the cause of higher business education and training for all individuals; To foster high ideals for everyone pursuing a career in business; To encourage fraternity and cooperation among people preparing for such careers; To stimulate the spirit of sacrifice and unselfish devotion to the attainment of such ends.

          Our aim is to continue the strong traditions of this fraternity and enrich the community of Boston University. We hope you will join us on our journey!</h3> */}
      </div>
      {renderInput("firstName", "First Name", "text", true)}
      {renderInput("lastName", "Last Name", "text", true)}
      {renderInput("preferredName", "Preferred Name")}
      {renderInput("major", "Major", "text", true)}
      {renderInput("minor", "Minor", "text")}
      {renderInput("gpa", "GPA (N/A if not applicable)", "text", true)}
      {renderInput("gradYear", "Expected Graduation Date (Month Year)", "text", true)}

      <label className="block mb-2 text-sm font-medium text-gray-900">College / School <span className="text-red-500">*</span></label>
      <fieldset className="grid gap-2 grid-cols-4 mb-6">
        {Object.entries(formData.colleges).map(([college, isChecked]) => (
          <label key={college} className="flex text-xs">
            <input
              className="mr-2"
              type="checkbox"
              name={college}
              checked={isChecked}
              onChange={handleCollegeChange}
            />
            {college}
          </label>
        ))}
      </fieldset>



      {renderInput("email", "Email", "email", true)}
      {renderInput("phone", "Phone Number", "phone", true)}
      {renderInput("linkedin", "LinkedIn Profile", "phone")}
      {renderInput("website", "Website / Portfolio", "phone")}

      <div className="flex">
        <label className="block mb-4 text-md font-medium text-gray-900">Upload your resume</label>
        <input className="flex" type="file" id="fileInput" name="fileInput" />
      </div>

      <div className="flex">
        <label className="block mb-4 text-md font-medium text-gray-900">Upload a picture of yourself</label>
        <input type="file" id="fileInput" name="fileInput" />
      </div>
      
      <button
        className="ml-auto items-center mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={handleSubmit} // Use onClick to trigger handleSubmit
        type="button" // Use type="button" to prevent form submission
      >
        Submit
      </button>
    </form>
  )
}
