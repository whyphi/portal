'use client'
import { useState } from "react";
import { Path, useForm, UseFormRegister, SubmitHandler } from "react-hook-form"

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
  responses: string[];
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
  responses: [""]
};

export default function Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)
  

  const [formData, setFormData] = useState<FormData>(initialValues);
  const [resumeFileName, setResumeFileName] = useState<String>("");
  const [imageFileName, setImageFileName] = useState<String>("");

  const maxWordCount = 200; // Adjust as needed
  const presetQuestions = [
    "Tell us about yourself. What are you passionate about/what motivates you?",
  ];

  // const handleSubmit = async () => {
  //   console.log(formData)
  // }


  const handleResponseChange = (index: number, value: string) => {
    const responsesCopy = [...formData.responses];
    responsesCopy[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      responses: responsesCopy,
    }));
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const renderResponseInputs = () => {
    return formData.responses.map((response, index) => (
      <div key={index} className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {presetQuestions[index]} (Max {maxWordCount} words) <span className="text-red-500">*</span>
        </label>
        <textarea
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32"
          {...register("responses", { required: true, maxLength: 200})} // Uses react-hook-form to add maxLength to textarea
          value={response}
          onChange={(e) => handleResponseChange(index, e.target.value)}
        />
        <p className="text-sm text-gray-500">
          {maxWordCount - getWordCount(response) >= 0
            ? `Remaining words: ${maxWordCount - getWordCount(response)}`
            : "Remaining words: Over word count!"}
        </p>
      </div>
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
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

  const renderInput = (
    id: keyof FormData,
    register: UseFormRegister<FormData>,
    label: string,
    type: string = "text",
    required: boolean = false
  ) => (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
        {...register(id, { required })}
        id={id}
        type={type}
        placeholder={label}
        value={formData[id] as string}
        onChange={handleChange}
        required={required}
      />
    </div>
  );


  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4 text-purple-800",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400"
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div>
        <h1 className={textStyles.title}>PCT Fall 2023 Application</h1>
        {/* <h3 className={textStyles.subtitle}>To promote the cause of higher business education and training for all individuals; To foster high ideals for everyone pursuing a career in business; To encourage fraternity and cooperation among people preparing for such careers; To stimulate the spirit of sacrifice and unselfish devotion to the attainment of such ends.

          Our aim is to continue the strong traditions of this fraternity and enrich the community of Boston University. We hope you will join us on our journey!</h3> */}
      </div>

      {renderInput("firstName", register, "First Name", "text", true)}
      {renderInput("lastName", register, "Last Name", "text", true)}
      {renderInput("preferredName", register, "Preferred Name")}
      {renderInput("major", register, "Major", "text", true)}
      {renderInput("minor", register, "Minor", "text")}
      {renderInput("gpa", register, "GPA (N/A if not applicable)", "text", true)}
      {renderInput("gradYear", register, "Expected Graduation Date (Month Year)", "text", true)}

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
            />
            {college}
          </label>
        ))}
      </fieldset>



      {renderInput("email", register, "Email", "email", true)}
      {renderInput("phone", register, "Phone Number", "text", true)}
      {renderInput("linkedin", register, "LinkedIn Profile", "text", true)}
      {renderInput("website", register, "Website / Portfolio", "text", true)}


      {/* Upload your resume */}
      <div className="flex flex-col mb-6">
        <label className="block mb-4 text-sm font-medium text-gray-900">Upload your resume <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type="file"
            id="resume"
            name="resume"
            className="absolute inset-0 opacity-0 z-10"
            onChange={handleFileChange}
          />
          <button className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2">
            Upload Resume
          </button>
          {resumeFileName && <p className="text-gray-500 text-xs mt-1">{resumeFileName}</p>}
        </div>
      </div>

      {/* Upload a picture of yourself */}
      <div className="flex flex-col mb-6">
        <label className="block mb-4 text-sm font-medium text-gray-900">Upload a picture of yourself <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            className="absolute inset-0 opacity-0 z-10"
            onChange={handleFileChange}
          />
          <button className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2">
            Upload Image
          </button>
          {imageFileName && <p className="text-gray-500 text-xs mt-1">{imageFileName}</p>}
        </div>
      </div>

      {renderResponseInputs()}
      <button
        className="ml-auto items-center mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={handleSubmit(onSubmit)} // Use onClick to trigger handleSubmit
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}
