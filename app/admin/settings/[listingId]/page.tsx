"use client"

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import { Listing } from "@/types/listing";
import { Button, Modal, TextInput } from 'flowbite-react';
import CustomAlert from "@/components/admin/settings/CustomAlert";
import { useAuth } from "@/app/contexts/AuthContext";
import { AdminTextStyles } from "@/styles/TextStyles";


interface FormData {
  title: string;
  questions: { [key: string]: string }[];
  deadline: Date;
}

const initialValues: FormData = {
  title: "",
  questions: [],
  deadline: new Date(),
};

export default function ListingSettings({ params }: { params: { listingId: string } }) {
  const { token } = useAuth();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [listingData, setListingData] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // For API Alerts
  const [showAlert, setShowAlert] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  useEffect(() => {
    // Fetch listing data from your /listings API endpoint
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.listingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Listing) => {
        // Set the form data with the fetched listing data
        setListingData(data)
        setFormData({
          title: data.title,
          questions: data.questions,
          deadline: new Date(data.deadline), // Assuming data.deadline is a valid date string
        });
        setSelectedDate(new Date(data.deadline));
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching listing:", error));
  }, [params.listingId, token]); // Include params.listingId in the dependency array

  useEffect(() => {
    if (showAlert) {
      const timeoutId = setTimeout(() => {
        setShowAlert(false); // Hide the alert after 5 seconds
      }, 3000);

      return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount or when showAlert changes
    }
  }, [showAlert]);

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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithDates),
      });

      if (response.ok) {
        console.log("Request successful!");
        router.push("/admin");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Listing deleted successfully!");
        router.push("/admin");
      } else {
        console.error("Delete request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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


  const renderQuestions = () => {
    return (
      <div>
        <div className="flex flex-col border rounded mb-6 p-4">
          {formData.questions.length === 0 ? (
            <p className={AdminTextStyles.default}>None</p>
          ) : (
            formData.questions.map((questionObj, index) => (
              <div className="w-full" key={index}>
                <div className="flex justify-end">
                  <svg
                    onClick={() => handleRemoveQuestion(index)}
                    className="w-4 h-4 text-gray-800 dark:text-white cursor-pointer"
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
                      d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div className="mb-6">
                  <label className={`block ${AdminTextStyles.subtext}`}>
                    Question <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    className="block w-full"
                    id={`question-${index}`}
                    type="text"
                    placeholder="Question"
                    value={questionObj.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className={`block ${AdminTextStyles.subtext}`}>
                    Additional Context / Subheadings
                  </label>
                  <TextInput
                    className="block w-full"
                    id={`additional-${index}`}
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
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          isClearable
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className={`w-full ${AdminTextStyles.datepicker}`}
          wrapperClassName="w-64"
        />
      </div>
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      title: newTitle,
    }));
  };

  const handleFieldValueSave = async (field: string, value: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.listingId}/update-field`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: field,
          value: value,
        }),
      });

      if (response.ok) {
        setIsErrorAlert(false);
        handleShowAlert(`${field} updated`)
      } else {
        setIsErrorAlert(true);
        handleShowAlert(`${response.status} ${response.statusText}`);
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      setIsErrorAlert(true);
      handleShowAlert("Error.")
      console.error("Error:", error);
    }
  };


  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  const handleShowAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mb-8">
      {showAlert ? (<CustomAlert message={alertMessage} isError={isErrorAlert} onClose={handleAlertClose} />) : (<></>)}

      <h1 className={AdminTextStyles.title}>Settings</h1>

      <div className="flex flex-col border rounded-lg mt-6 p-4">
        <h3 className={AdminTextStyles.default}>Title</h3>
        <TextInput
          className="mb-4 block w-full"
          placeholder={formData.title}
          value={formData.title}
          onChange={handleTitleChange}
          required={true}
        />
        <button
          type="button"
          className="w-24 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => handleFieldValueSave("title", formData.title)}
        >
          Save
        </button>
      </div>

      {/* {renderInput("title", "Title", "text", true)} */}


      <div className="flex flex-col border rounded-lg mt-6 p-4">
        <h3 className={AdminTextStyles.default}>Questions</h3>
        {renderQuestions()}
        <button
          type="button"
          className="w-24 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => handleFieldValueSave("questions", formData.questions)}
        >
          Save
        </button>
      </div>

      <div className="flex flex-col border rounded-lg mt-6 p-4">
        <h3 className={AdminTextStyles.default}>Deadline</h3>
        {renderDeadline()}
        <button
          type="button"
          className="w-24 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => handleFieldValueSave("deadline", formData.deadline)}
        >
          Save
        </button>
      </div>

      <div className="flex flex-col border border-red-500 dark:border-red-400 rounded-t-lg mt-6 p-4">
        <h3 className={AdminTextStyles.default}>Delete Listing</h3>
        <p className={AdminTextStyles.subcontent}>Permanently remove the listing and all its associated content and data from the Whyphi platform. This action is not reversible, so please continue with caution.</p>
      </div>

      <div className="flex justify-end border border-red-500 dark:border-red-400 rounded-b-lg p-2 bg-red-200 dark:bg-red-300">
        <Button
          type="button"
          gradientMonochrome="failure"
          onClick={() => setOpenModal(true)}
        >
          Delete
        </Button>
      </div>

      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Delete Listing</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Permanently remove the listing and all its associated content and data from the Whyphi platform. This action is not reversible, so please continue with caution.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this listing?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientMonochrome="failure" onClick={handleDelete}>Delete</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


    </form>
  );
}
