"use client"
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation'
import { Checkbox, Label } from 'flowbite-react';



interface FormData {
  title: string;
  questions: { [key: string]: string }[]; // Array of objects with string keys
  deadline: Date;
  includeEventsAttended: boolean;
}

const initialValues: FormData = {
  title: "",
  questions: [],
  deadline: new Date(),
  includeEventsAttended: false
};

export default function Create() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleSubmit = async () => {
    const currentDate = new Date();
    const formattedDeadline = selectedDate.toISOString();
    const formDataWithDates = {
      ...formData,
      dateCreated: currentDate.toISOString(),
      deadline: formattedDeadline,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithDates),
      });

      if (response.ok) {
        // The request was successful, you can handle the response here if needed.
        console.log("Request successful!");
        router.push("/admin"); // Replace "/admin" with the actual route to your admin page

      } else {
        // Handle the case where the request was not successful.
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      // Handle any network errors or other exceptions that may occur.
      console.error("Error:", error);
    }
  };

  function flattenQuestions(questions: { [key: string]: string }[]): { [key: string]: string } {
    // Flatten the 'questions' array into a flat object
    const flattenedQuestions = questions.reduce(
      (acc, question, index) => {
        Object.keys(question).forEach((key) => {
          acc[`questions[${index}].${key}`] = question[key];
        });
        return acc;
      },
      {} as Record<string, string>
    );

    return flattenedQuestions;
  }

  const handlePreview = async () => {
    const currentDate = new Date();
    const formattedDeadline = selectedDate.toISOString();
    const formDataWithDates = {
      ...formData,
      dateCreated: currentDate.toISOString(),
      deadline: formattedDeadline,
    };

    // Encode the form data into a query parameter string
    const { questions, includeEventsAttended, ...formDataStringsOnly } = formDataWithDates;
    const flattenedQuestions = flattenQuestions(formData.questions)
    const includeEventsAttendedString = includeEventsAttended.toString()


    const formDataQueryString = new URLSearchParams({
      ...formDataStringsOnly,
      ...flattenedQuestions,
      'includeEventsAttended': includeEventsAttendedString
    });

    // Open a new tab and navigate to the preview route with form data as query parameters
    window.open(`/admin/create/preview/listing?${formDataQueryString}`, '_blank');

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: checked,
    }));
  };

  const handleAddQuestion = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, { question: "", additional: "" }],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const renderInput = (
    id: keyof FormData,
    label: string,
    type: string = "text",
    required: boolean = false
  ) => (
    <div className="sm:w-full md:w-96 mb-6">
      <label className="block mb-2 text-md font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
        id={id as string} // Convert the id to a string
        type={type}
        placeholder={label}
        value={formData[id] as string}
        onChange={handleChange}
        required={required}
      />
    </div>
  );

  const renderQuestions = () => {
    return (
      <div>
        <div className="flex flex-col border rounded mb-6 p-4">
          {formData.questions.length === 0 ? (
            "None"
          ) : (
            formData.questions.map((questionObj, index) => (
              <div className="w-full" key={index}>
                <div className="flex justify-end">
                  <svg
                    onClick={() => handleRemoveQuestion(index)}
                    className="w-4 h-4 text-gray-800 dark:text-white hover:bg-gray-100"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    id={`question-${index}`} // Set a unique id for each question input
                    type="text"
                    placeholder="Question"
                    value={questionObj.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Additional Context / Subheadings
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    id={`additional-${index}`} // Set a unique id for each additional input
                    type="text"
                    placeholder="Add any additional text that explains the question here"
                    value={questionObj.additional}
                    onChange={(e) =>
                      handleQuestionChange(index, "additional", e.target.value)
                    }
                  />
                </div>
                <hr className="h-px mb-2 bg-gray-200 border-0 dark:bg-gray-700" />
              </div>
            ))
          )}
        </div>
        <button
          onClick={handleAddQuestion}
          type="button"
          className="w-full mb-8 text-center inline-flex items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            className="w-4 h-4 text-gray-800 dark:text-white mr-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>{" "}
          Add Question
        </button>
      </div>


    );
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setFormData((prevData) => ({
      ...prevData,
      deadline: date,
    }));
  };

  const renderDeadline = () => {
    return (
      <div className="w-full mb-6">
        <label className="block mb-2 text-md font-medium text-gray-900">
          Deadline <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          isClearable
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
          wrapperClassName="w-64" // Add a custom class to make it full width
        />
      </div>
    );
  };

  const renderAdditionalSection = () => {
    return (
      <div className="w-full mb-6">
        <label className="block mb-2 text-md font-medium text-gray-900">
          Additional
        </label>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.includeEventsAttended}
            onChange={handleCheckboxChange}
            id="includeEventsAttended"
            className="focus:ring-purple-500 dark:focus:ring-purple-600 text-purple-600" />
          <Label htmlFor="includeEventsAttended" className="font-light">I want to collect <span className="font-medium underline">Events Attended</span> data</Label>
        </div>
      </div>
    )
  }

  const textStyles = {
    title: "text-4xl font-bold dark:text-white mb-6 mt-4",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mb-8">
      <h1 className={textStyles.title}>Create a New Listing</h1>

      {renderInput("title", "Title", "text", true)}

      <label className="block mb-2 text-md font-medium text-gray-900">
        Questions
      </label>

      {renderQuestions()}
      {renderDeadline()}
      {renderAdditionalSection()}

      <button
        type="button"
        className="w-24 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <button
        type="button"
        className="w-24 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={handlePreview}
      >
        Preview
      </button>
    </form>
  );
}
