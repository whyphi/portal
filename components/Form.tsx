'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';

import { Events, FormData, FormProps } from "@/types/form"

const initialValues: FormData = {
  gradYear: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  major: '',
  minor: '',
  gpa: '',
  hasGpa: true,
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
  events: null,
  responses: []
};


export default function Form({ title, questions, listingId, includeEventsAttended }: FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialValues);
  console.log(formData.gpa, formData.hasGpa)
  const [resumeFileName, setResumeFileName] = useState<String>("");
  const [imageFileName, setImageFileName] = useState<String>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  if (includeEventsAttended) {
    initialValues.events = {
      infoSession1: false,
      infoSession2: false,
      workshop1: false,
      workshop2: false,
      social1: false,
      social2: false
    }
  }
  
  const maxWordCount = 200; // Adjust as needed
  
  const checkRequiredFields = () => {
    const requiredFields = ['firstName', 'lastName', 'major', 'gpa', 'gradYear', 'email', 'phone', 'resume', 'image'];
    const incompleteFields: string[] = [];
    
    Object.entries(formData).forEach(([field, value]) => {
      if (requiredFields.includes(field) && (!value || (typeof value === 'string' && !value.trim()))) {
        incompleteFields.push(field);
      }
    });
    
    if (incompleteFields.length > 0) {
      alert(`Incomplete fields. Please fill in all required fields.`);
      return false;
    } else if (
      formData.responses.length < questions.length ||
      formData.responses.some(response => typeof response === 'string' && response.trim() === '')
    ) {
      alert(`Incomplete fields. Please fill in all required fields.`);
      return false;
    } else if (
      formData.responses.some(response => {
        if (typeof response === 'string') {
          const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
          return wordCount > maxWordCount;
        }
        return false;
      })
    ) {
      alert(`One or more responses are over the maximum word count. Please edit your response.`);
      return false;
    }
    return true;
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Check for incomplete required fields
      const requiredFieldsComplete = checkRequiredFields();
      if (!requiredFieldsComplete) {
        setIsSubmitting(false);
        return;
      }
      // Construct the data object to send to the API
      const responseObjects = questions.map((question, index) => ({
        question: question.question,
        response: formData.responses[index],
      }));

      const dataToSend = {
        listingId: listingId,
        ...formData,
        responses: responseObjects, // Replace the 'responses' array with response objects
      };

      // Make a POST request to the /submit API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Handle successful response here, e.g., show a success message or redirect
        router.push(`/public/success`);
      } else {
        // Handle error response here, e.g., show an error message
        setIsSubmitting(false);
        console.error('Error submitting form');
        alert(`Error submitting form. Please contact PCT with a screenshot of the error!`);
      }
    } catch (error) {
      // Handle any unexpected errors here
      setIsSubmitting(false);
      console.error('An error occurred:', error);
      alert(`An error occurred: ` + error + `. Please contact PCT with a screenshot of the error!`);
    }
  };


  const handleResponseChange = (index: number, value: string) => {
    const responsesCopy = [...formData.responses];
    responsesCopy[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      responses: responsesCopy,
    }));
  };

  const getWordCount = (text: string | undefined) => {
    // Check if text is undefined or null and return 0 in that case
    if (text === undefined || text === null) {
      return 0;
    }

    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Component that handles essay questions
  const renderResponseInputs = () => {
    return questions.map((question, index) => (
      <div key={index} className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {question.question} (Max {maxWordCount} words) <span className="text-red-500">*</span>
        </label>
        <textarea
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 h-32"
          value={formData.responses[index]}
          onChange={(e) => handleResponseChange(index, e.target.value)}
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500">
          {maxWordCount - getWordCount(formData.responses[index]) + 1 >= 0
            ? `Remaining words: ${maxWordCount - getWordCount(formData.responses[index])}`
            : "Remaining words: Over word count!"}
        </p>
      </div>
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // handle edge case : only update `gpa` if valid
    if (id === "gpa") {
      if (Number(value) >= 0 && Number(value) <= 4) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const file = e.target.files ? e.target.files[0] : null;

    // File validation helper function
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validateFileType = (selectedFile: File | null): boolean => {
      return !!selectedFile && allowedTypes.includes(selectedFile.type);
    };

    // Set filename states to "" since cancelling upload makes file in form null
    if (id === "resume") {
      setResumeFileName("");
    } else if (id === "image") {
      setImageFileName("");
    }

    if (file) {
      // Perform file validation
      if (!validateFileType(file)) {
        alert('Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file.');
        return;
      }

      if (id === "resume") {
        setResumeFileName(file.name);
      } else if (id === "image") {
        setImageFileName(file.name);
      }
      // Read the file as a base64 string
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          [id]: base64String, // Store the base64 string directly
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Clear the file or base64 property if no file is selected
      setFormData((prevData) => ({
        ...prevData,
        [id]: null,
      }));
    }
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

  const handleHasGpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) {
      // case 1 : checked (didn't have gpa, now does -> no change to `gpa`)
      setFormData((prevData) => ({
        ...prevData,
        [name]: !checked,
        gpa : "",
      }));
    } else {
      // case 2 : unchecked (had gpa selected, but now reset `gpa` to empty string "")
      setFormData((prevData) => ({
        ...prevData,
        [name]: !checked,
      }));
    }
  }

  const handleEventsAttendedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      events: {
        ...prevData.events,
        [name]: checked,
      },
    }) as FormData);
  };
  

  const renderInput = (
    id: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = false
  ) => (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label !== 'gpa' && label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
        id={id}
        type={type}
        placeholder={label}
        value={formData[id] as string}
        onChange={handleChange}
        required={required}
        disabled={isSubmitting}
        />
    </div>
  );
  
  const renderGpaSection = () => {
    
    return (
      <div>
        {/* className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5" */}
        <label className="block mb-2 text-sm font-medium text-gray-900">
          GPA (N/A if not applicable) <span className="text-red-500">*</span>
        </label>
        <label className="flex text-xs">
          <input
            className="mr-2 focus:ring-purple-300 text-purple-600"
            type="checkbox"
            name="hasGpa"
            checked={!formData.hasGpa}
            onChange={handleHasGpaChange}
            disabled={isSubmitting}
          />
          N/A
        </label>
        {formData.hasGpa ?
          <>
            {renderInput("gpa", "gpa", "number")}
          </>
          :
          <div className="mb-10"></div>
        }
      </div>

    )
  }

  const renderEventsAttendedSection = () => {

    // Helper function to convert id to name
    const renderEventName = (eventId: string) => {
      const eventIdToName = {
        infoSession1: "Info Session 1",
        infoSession2: "Info Session 2",
        workshop1: "Workshop 1",
        workshop2: "Workshop 2",
        social1: "Social 1",
        social2: "Social 2"
      };

      return eventIdToName[eventId as keyof typeof eventIdToName] || "Unknown Event";
    };

    return (
      <>
        <label className="block mb-2 text-sm font-medium text-gray-900">Events Attended <span className="text-red-500">*</span></label>
        <fieldset className="grid gap-2 grid-cols-4 mb-6">
          {formData.events && Object.entries(formData.events).map(([event, isChecked]) => (
            <label key={event} className="flex text-xs">
              <input
                className="mr-2 focus:ring-purple-300 text-purple-600"
                type="checkbox"
                name={event}
                checked={isChecked}
                onChange={handleEventsAttendedChange}
                disabled={isSubmitting}
              />
              {renderEventName(event)}
            </label>
          ))}
        </fieldset>
      </>
    )
  };


  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 text-purple-800",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400"
  }

  return (

    <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full">
      <div>
        <h1 className={textStyles.title}>{title}</h1>
      </div>

      {renderInput("firstName", "First Name", "text", true)}
      {renderInput("lastName", "Last Name", "text", true)}
      {renderInput("preferredName", "Preferred Name")}
      {renderInput("major", "Major", "text", true)}
      {renderInput("minor", "Minor", "text")}
      {renderGpaSection()}
      {renderInput("gradYear", "Expected Graduation Date (Month Year) | (Example: May 2026)", "text", true)}

      <label className="block mb-2 text-sm font-medium text-gray-900">College / School <span className="text-red-500">*</span></label>
      <fieldset className="grid gap-2 grid-cols-4 mb-6">
        {Object.entries(formData.colleges).map(([college, isChecked]) => (
          <label key={college} className="flex text-xs">
            <input
              className="mr-2 focus:ring-purple-300 text-purple-600"
              type="checkbox"
              name={college}
              checked={isChecked}
              onChange={handleCollegeChange}
              disabled={isSubmitting}
            />
            {college}
          </label>
        ))}
      </fieldset>

      {renderInput("email", "Email", "email", true)}
      {renderInput("phone", "Phone Number (xxx-xxx-xxxx)", "text", true)}
      {renderInput("linkedin", "LinkedIn Profile", "text")}
      {renderInput("website", "Website / Portfolio", "text")}

      <div className="flex flex-col mb-6">
        <label className="block mb-4 text-sm font-medium text-gray-900">Upload your resume (PDF) <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type="file"
            id="resume"
            name="resume"
            className="absolute inset-0 opacity-0 z-10"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <button
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
            disabled={isSubmitting}
          >
            Upload Resume
          </button>
          {resumeFileName && <p className="text-gray-500 text-xs mt-1">{resumeFileName}</p>}
        </div>
      </div>

      <div className="flex flex-col mb-6">
        <label className="block mb-4 text-sm font-medium text-gray-900">Upload a picture of yourself (JPG/JPEG/PNG) <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            className="absolute inset-0 opacity-0 z-10"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <button
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
            disabled={isSubmitting}
          >
            Upload Image
          </button>
          {imageFileName && <p className="text-gray-500 text-xs mt-1">{imageFileName}</p>}
        </div>
      </div>

      {includeEventsAttended && renderEventsAttendedSection()}

      {questions && renderResponseInputs()}
      <Button
        fullSized
        onClick={handleSubmit}
        gradientMonochrome="purple"
        isProcessing={isSubmitting}
        processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
        disabled={isSubmitting}
      >
        Submit
      </Button>

      {/* Original button below */}
      {/* <button
          type="button"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={handleSubmit}>
          Submit
        </button> */}


    </form >
  )
}
