'use client'
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, Alert, TextInput, Checkbox, Textarea, Select } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiOutlineX } from "react-icons/hi";
import { FormData, FormProps } from "@/types/form"
import { AdminTextStyles, ThinAdminTextStyles } from "@/styles/TextStyles";
import YearSelect from "./public/YearSelect";

const initialValues: FormData = {
  gradYear: '',
  gradMonth: '',
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


export default function Form({ title, listingId, questions, includeEventsAttended, isPreview }: FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [resumeFileName, setResumeFileName] = useState<String>("");
  const [imageFileName, setImageFileName] = useState<String>("");
  const [resumeFileSize, setResumeFileSize] = useState<number>(0);
  const [imageFileSize, setImageFileSize] = useState<number>(0);
  const MAX_FILE_SIZE_BYTES = 6 * 1000 * 1000 - 1
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isInfoAlert, setIsInfoAlert] = useState<boolean>(true);
  
  // Confirmation Checkboxes
  const [confirmUndergraduate, setConfirmUndergraduate] = useState(false);
  const [confirmNotStudyingAbroad, setConfirmNotStudyingAbroad] = useState(false);

  if (includeEventsAttended) {
    initialValues.events = {
      infoSession1: false,
      infoSession2: false,
      resumeWorkshop: false,
      socialEvent: false,
      professionalPanel: false
    }
  }

  const maxWordCount = 200; // Adjust as needed

  const checkRequiredFields = () => {
    const possibleRequiredFields = ['firstName', 'lastName', 'major', 'gradMonth', 'gradYear', 'email', 'phone', 'resume', 'image'];
    const requiredFields = formData.hasGpa ? [...possibleRequiredFields, 'gpa'] : possibleRequiredFields
    const incompleteFields: string[] = [];

    Object.entries(formData).forEach(([field, value]) => {
      if (requiredFields.includes(field) && (!value || (typeof value === 'string' && !value.trim()))) {
        incompleteFields.push(field);
      }
    });

    if (incompleteFields.length > 0) {
      alert(`Incomplete fields. Please fill in all required fields`);
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
    } else if (!confirmUndergraduate) {
      alert(`Sorry, you are ineligible to apply to Phi Chi Theta, Zeta Chapter. Please ensure that you are currently a BU undergraduate student and not studying abroad.`);
      return false;
    } else if (!confirmNotStudyingAbroad) {
      alert(`Sorry, you are ineligible to apply to Phi Chi Theta, Zeta Chapter. Please ensure that you are currently a BU undergraduate student and not studying abroad.`);
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
        router.push(`/public/success`);
      } else {
        const code = response.status;
        if (code == 410) {
          const responseText = await response.text();
          setErrorMsg(responseText);
          setIsError(true);
        } else {
          console.error('Error submitting form');
          alert(`Error submitting form. Please contact PCT with a screenshot of the error!`);
        }
        setIsSubmitting(false);
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
      <div key={index} className="flex flex-col gap-1 mb-6">
        <label className={AdminTextStyles.default}>
          {question.question} (Max {maxWordCount} words) <span className="text-red-500">*</span>
        </label>
        <Textarea
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 h-32"
          value={formData.responses[index]}
          onChange={(e) => handleResponseChange(index, e.target.value)}
          placeholder={question.context}
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
    if (id === "gpa") {
      // case 1 : only update `gpa` if valid
      if (Number(value) >= 0 && Number(value) <= 4) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    } else if (id === "gradYear") {
      // case 2 : handle grad year (only accept positive integers)
      if (Number.isInteger(Number(value)) && Number(value) >= 0) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    } else {
      // case 3 : handle remaining metrics
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>, fieldName: string) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const file = e.target.files ? e.target.files[0] : null;

    // ensure id is in correct format
    if (id !== "resume" && id !== "image") {
      return;
    }

    // File conversion helper function
    const convertToMB = (bytes: number) => {
      // 1 megabyte = 1e6 bytes
      const megabytes = bytes / (1e6);
      return megabytes.toFixed(2);
    }

    // File validation helper function
    const allowedTypes = {
      resume: ['application/pdf'],
      image: ['image/jpeg', 'image/png']
    }
    const validateFileType = (selectedFile: File | null, fileId: keyof typeof allowedTypes): boolean => {
      return !!selectedFile && allowedTypes[fileId].includes(selectedFile.type);
    };

    // Set filename states to "" since cancelling upload makes file in form null
    if (id === "resume") {
      setResumeFileSize(0);
      setResumeFileName("");
    } else if (id === "image") {
      setImageFileSize(0);
      setImageFileName("");
    }

    if (file) {
      // Perform file validation
      if (!validateFileType(file, id)) {
        switch (id) {
          case "resume":
            alert('Invalid file type. Please upload a PDF file.');
            break;
          case "image":
            alert('Invalid file type. Please upload a JPG, JPEG, or PNG file.');
            break;
        }
        return;
      }

      // extract fileSize from file object
      const fileSize = file.size

      if (id === "resume") {
        // handle large files
        if (imageFileSize + fileSize > MAX_FILE_SIZE_BYTES) {
          alert(`Image file size of ${convertToMB(fileSize)} MB is too large. Total of ${convertToMB(MAX_FILE_SIZE_BYTES - imageFileSize)} MB available.`);
          return;
        }

        setResumeFileSize(fileSize);
        setResumeFileName(file.name);
      } else if (id === "image") {
        // handle large files
        if (resumeFileSize + fileSize > MAX_FILE_SIZE_BYTES) {
          alert(`Image file size of ${convertToMB(fileSize)} MB is too large. Total of ${convertToMB(MAX_FILE_SIZE_BYTES - resumeFileSize)} MB available.`);
          return;
        }

        setImageFileSize(fileSize);
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

      // reset file size validation
      if (id === "resume") {
        setResumeFileSize(0);
      } else if (id === "image") {
        setImageFileSize(0);
      }

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
        gpa: "",
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


  const RenderInput = (
    id: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = false
  ) => (
    <div className="flex flex-col gap-1 mb-6">
      <label className={`${AdminTextStyles.default}`}>
        {label !== 'gpa' && label} {required && <span className="text-red-500">*</span>}
      </label>
      <TextInput
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

  const RenderGpaCheckbox = () => {
    return (
      <div className="absolute top-1/2 transform -translate-y-1/2 right-6 text-xs">
        <label className={`flex text-xs ${ThinAdminTextStyles.subtext}`}>
          <Checkbox
            className="mr-2 dark:bg-gray-400 focus:ring-purple-300 text-purple-600"
            name="hasGpa"
            checked={!formData.hasGpa}
            onChange={handleHasGpaChange}
            disabled={isSubmitting}
          />
          N/A
        </label>
      </div>
    )
  }

  const RenderGpaSection = () => {
    return (
      <div className="flex flex-col gap-1 mb-6">
        <label className={AdminTextStyles.default}>
          GPA (N/A if not applicable) <span className="text-red-500">*</span>
        </label>
        {formData.hasGpa ?
          <div className="relative">
            <TextInput
              id="gpa"
              type="text"
              placeholder="GPA"
              value={formData["gpa"]}
              onChange={handleChange}
              required={true}
              disabled={isSubmitting}
            />
            {RenderGpaCheckbox()}
          </div>
          :
          <div className="relative">
            <TextInput
              id="gpa"
              type="text"
              placeholder="GPA"
              value={formData["gpa"]}
              onChange={handleChange}
              disabled={true}
              readOnly
            />
            {RenderGpaCheckbox()}
          </div>
        }
      </div>

    )
  }

  const RenderGradMonthYear = () => {
    return (
      <div className="flex flex-col gap-1">
        <label className={AdminTextStyles.default}>
          Expected Graduation Date <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-6">
          <Select
            id="gradMonth"
            placeholder="Month"
            value={formData["gradMonth"]}
            onChange={(e) => handleDropdownChange(e, "gradMonth")} // Pass the field name to handleChange
            className="w-1/2"
          >
            <option value="" disabled>Select Month</option>
            <option value="January">January</option>
            <option value="May">May</option>
          </Select>
          <YearSelect
            startYear={2020}
            endYear={2050}
            value={formData["gradYear"]}
            onChange={(e) => handleDropdownChange(e, "gradYear")} // Pass the field name to handleChange
            className="w-1/2"
            placeholder="Year"
            disabled={isSubmitting}
          />
        </div>
      </div>
    )
  }

  // TODO: make RenderEventsAttendedSection section auto-filled from rushee data and DISABLE editing

  const RenderErrorAlert = () => {
    return (
      <div className="fixed max-w-screen-sm w-full mt-4 z-50">
        <Alert
          className="z-1 shadow-md"
          color="failure"
          withBorderAccent
          onDismiss={() => {
            setIsError(false);
            setErrorMsg("");
          }}
        >
          <span className="font-medium">Error:</span> {errorMsg}
        </Alert>
      </div>
    );
  };

  const RenderInfoAlert = () => {
    return (
      <div className="fixed max-w-screen-sm w-full mt-10 z-50">
        <Alert
          className="z-1 shadow-md"
          color="warning"
          withBorderAccent
          onDismiss={() => {
            setIsInfoAlert(false);
          }}
        >
          <span className="font-medium">Important Notice:</span> To ensure timely processing in anticipation of high application volume, kindly submit your application a few minutes prior to the designated deadline.
    
          <br />
          <br />
          
          <span className="font-medium">For Assistance:</span> In case of technical difficulties during submission, please email <span className="underline">pct.bostonu@gmail.com</span> with a PDF containing all required application elements (outlined in the website), your photo and updated resume before the deadline.
        </Alert>
      </div>
    );
    
  };

  const RenderFileInput = (
    id: keyof FormData,
    label: string,
    type: string = "file",
    required: boolean = false
  ) => {
    // Create a ref to hold the reference to the input element
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to clear the input value
    const clearFileInput = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("clearing file")
      e.stopPropagation();
      if (fileInputRef.current) {
        // update resume/image name variables
        if (fileInputRef.current.id === "resume") {
          setResumeFileName("")
        } else if (fileInputRef.current.id === "image") {
          setImageFileName("")
        }
        fileInputRef.current.value = '';  // Clear the input value
        handleFileChange({ target: { id, files: null } } as ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="flex flex-col gap-1 mb-6">
        <label className={AdminTextStyles.default}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={fileInputRef}
            className="absolute inset-0 opacity-0 z-10"
            type={type}
            name={id}
            onChange={handleFileChange}
            required={required}
            disabled={isSubmitting}
          />
          <button
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
            disabled={isSubmitting}
          >
            Upload {id}
          </button>
        </div>
        {/* render either resume or image depending on id */}
        {id === 'resume' ?
          resumeFileName &&
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-xs">{resumeFileName}</p>
            <HiOutlineX
              className="text-gray-500 hover:text-gray-600 text-center cursor-pointer"
              onClick={(e: any) => clearFileInput(e)}
              // disabled={isSubmitting}
            />
          </div>
          :
          imageFileName &&
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-xs">{imageFileName}</p>
            <HiOutlineX
              className="text-gray-500 hover:text-gray-600 text-center cursor-pointer"
              onClick={(e: any) => clearFileInput(e)}
              // disabled={isSubmitting}
            />
          </div>
        }
      </div>
    );
  }


  return (

    <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full">

      {isInfoAlert && RenderInfoAlert()}
      {isError && RenderErrorAlert()}

      <div>
        <h1 className={AdminTextStyles.title}>{title}</h1>
      </div>

      {RenderInput("firstName", "First Name", "text", true)}
      {RenderInput("lastName", "Last Name", "text", true)}
      {RenderInput("preferredName", "Preferred Name")}
      {RenderInput("major", "Major", "text", true)}
      {RenderInput("minor", "Minor", "text")}
      {RenderGpaSection()}
      {RenderGradMonthYear()}
      {/* {RenderInput("gradYear", "Expected Graduation Date (Month Year) | (Example: May 2026)", "text", true)} */}

      <div className="flex flex-col gap-1">
        <label className={AdminTextStyles.default}>
          College / School <span className="text-red-500">*</span>
        </label>
        <fieldset className="grid gap-2 grid-cols-4 mb-6">
          {Object.entries(formData.colleges).map(([college, isChecked]) => (
            <label key={college} className={AdminTextStyles.subtext}>
              <Checkbox
                className="mr-2 focus:ring-purple-300 text-purple-600"
                // type="checkbox"
                name={college}
                checked={isChecked}
                onChange={handleCollegeChange}
                disabled={isSubmitting}
              />
              {college}
            </label>
          ))}
        </fieldset>
      </div>

      {RenderInput("email", "Email", "email", true)}
      {RenderInput("phone", "Phone Number (xxx-xxx-xxxx)", "text", true)}
      {RenderInput("linkedin", "LinkedIn Profile", "text")}
      {RenderInput("website", "Website / Portfolio", "text")}
      {RenderFileInput("resume", "Upload Your Resume (PDF)", "file", true)}
      {RenderFileInput("image", "Upload Profile Picture (PNG/JPG/JPEG)", "file", true)}

      {questions && renderResponseInputs()}

      <div className="flex items-center mb-2">
        <Checkbox
          className="mr-2 focus:ring-purple-300 text-purple-600"
          checked={confirmUndergraduate}
          onChange={() => setConfirmUndergraduate(prevValue => !prevValue)}
          required={true}
          disabled={isSubmitting}
        />
        <Label>
          Please confirm that you are currently a BU undergraduate student.
          <span className="text-red-500">*</span>
        </Label>
      </div>

      <div className="flex items-center mb-8">
        <Checkbox
          className="mr-2 focus:ring-purple-300 text-purple-600"
          checked={confirmNotStudyingAbroad}
          onChange={() => setConfirmNotStudyingAbroad(prevValue => !prevValue)}
          required={true}
          disabled={isSubmitting}
        />
        <Label>
          Please confirm that you are currently NOT studying abroad.
          <span className="text-red-500">*</span>
        </Label>
      </div>

      <Button
        fullSized
        onClick={handleSubmit}
        gradientMonochrome="purple"
        isProcessing={isSubmitting}
        processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
        disabled={isSubmitting || isPreview}
      >
        Submit
      </Button>

    </form >
  )
}
