"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import ReactStars from "react-stars";
import { Button, Label, Alert } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineX } from "react-icons/hi";
import Loader from "@/components/Loader";
import { InterviewFormData, InterviewFormProps, InterviewQA } from "@/types/form";

const initialValues: InterviewFormData = {
  rusheeFullName: "",
  brother1FullName: "",
  brother2FullName: "",
  responses: [],
};

export default function Form({
  title,
  instructions,
  semester,
  questions = [],
  listingId,
  isPreview,
}: InterviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<InterviewFormData>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      responses: questions.map((question) => ({
        question: question[0],
        response: "",
        rating: 0,
        comments: "",
      })),
    }));
    setLoading(false);
  }, [questions]);

  // TO-DO: To enforce certain questions always being asked in interviews.
  const checkRequiredFields = () => {
    return true;
  };

  // TO-DO: Update URL for interview submission.
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
        question: question[0],
        response: formData.responses[index],
      }));

      const dataToSend = {
        listingId: listingId,
        ...formData,
        responses: responseObjects, // Replace the 'responses' array with response objects
      };

      // Make a POST request to the /submit API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          console.error("Error submitting form");
          alert(`Error submitting form. Please contact PCT with a screenshot of the error!`);
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      // Handle any unexpected errors here
      setIsSubmitting(false);
      console.error("An error occurred:", error);
      alert(`An error occurred: ` + error + `. Please contact PCT with a screenshot of the error!`);
    }
  };

  const handleResponseChange = (index: number, value: string) => {
    const responsesCopy = [...formData.responses];
    responsesCopy[index].response = value;
    setFormData((prevData) => ({
      ...prevData,
      responses: responsesCopy,
    }));
  };

  // TO-DO: update + fix to properly update all fields of responses
  const renderResponseInputs = () => {
    return questions.map((question, index) => (
      <div key={index} className="mb-6">
        <label className="block text-sm font-medium text-gray-900">{question[0]}</label>
        <p className="text-sm italic text-gray-500 mb-2">{question[1]}</p>
        <div className="flex flex-row space-x-2">
          <textarea
            className="bg-gray-50 flex-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block md:w-6/12 p-2.5 h-32"
            value={formData.responses[index].response}
            onChange={(e) => handleResponseChange(index, e.target.value)}
            placeholder="Interviewee Response Here"
            disabled={isSubmitting}
          />
          <div className="flex-1 flex flex-col">
            <p className="text-sm mx-auto text-gray-500">Feedback</p>
            <ReactStars className="mx-auto" count={5} size={24} color2={"#ffd700"}></ReactStars>
            <textarea
              className="bg-gray-50 mx-auto w-full flex-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 h-32"
              placeholder="Comments"></textarea>
          </div>
        </div>
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

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>, fieldName: string) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const RenderInput = (
    id: keyof InterviewFormData,
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
          }}>
          <span className="font-medium">Error:</span> {errorMsg}
        </Alert>
      </div>
    );
  };

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-2 mt-2",
    heading: "text-lg font-bold dark:text-white mb-2 text-purple-800",
    subtitle: "mb-2 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full">
      {isError && RenderErrorAlert()}

      <div>
        <p className={textStyles.title}>{title}</p>
        <p className={textStyles.heading}>{semester}</p>
        <p className={textStyles.subtitle}>{instructions}</p>
      </div>

      <div className="h-0.5 bg-gray-500 mt-2 mb-4"></div>

      {RenderInput("rusheeFullName", "Rushee Full Name", "text", true)}
      {RenderInput("brother1FullName", "Brother 1 Full Name", "text", true)}
      {RenderInput("brother2FullName", "Brother 2 Full Name")}
      {questions && renderResponseInputs()}

      <Button
        fullSized
        onClick={handleSubmit}
        gradientMonochrome="purple"
        isProcessing={isSubmitting}
        processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
        disabled={isSubmitting || isPreview}>
        Submit
      </Button>
    </form>
  );
}
