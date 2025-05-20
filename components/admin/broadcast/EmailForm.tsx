"use client"; // what does this mean
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Datepicker,
  Dropdown,
  DropdownItem,
  Checkbox,
} from "flowbite-react";

import QuickBroadcast from "@/components/admin/broadcast/QuickBroadcastModal";
import JobPostingServiceModal from "@/components/admin/broadcast/JobPostingServiceModal";

interface EmailFormData {
  subject: string;
  content: string;
}

const initialValues: EmailFormData = {
  subject: "",
  content: "",
};

// useless for first pass

// interface EmailFormProps {
//   title: string | null,
//   emailID: string | null;
// }

export default function EmailForm() {
  const now: Date = new Date();
  const dateFormatter = (date: Date): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = date.getFullYear();
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    // determine English ordinal suffix
    const getSuffix = (d: number) => {
      if (d % 100 >= 11 && d % 100 <= 13) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const suffix = getSuffix(day);
    return `${monthName} ${day}${suffix}, ${year}`;
  };
  const timeFormatter = (time24: string): string => {
    const [hStr, mStr] = time24.split(":");
    let hour = parseInt(hStr, 10);
    const minute = mStr.padStart(2, "0");

    const ampm = hour >= 12 ? "PM" : "AM";
    // convert “0” → “12”, and 13–23 → 1–11
    hour = hour % 12 === 0 ? 12 : hour % 12;

    return `${hour}:${minute} ${ampm}`;
  };

  // quick broadcast variables
  const router = useRouter();
  const [formData, setFormData] = useState<EmailFormData>(initialValues);
  const [openQuickBroadcastModal, setQuickBroadcastModal] = useState(false);

  // job posting service variables
  const [openJobPostingModal, setJobPostingModal] = useState(false);

  // scheduling variables
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [beginDate, setBeginDate] = useState(now); // e.g. "2025-05-18"
  const [endDate, setEndDate] = useState(now); // e.g. "2025-05-23"
  const resetScheduleVariables = () => {
    setScheduleEnabled(false);
    setFrequency("");
    setDayOfWeek("Monday");
    setDayOfMonth(0);
    setTimeOfDay("09:00");
    setBeginDate(now);
    setEndDate(now);
  };

  // TODO: auto-format HTML????

  const emailFormHeaders = new Headers({
    "Content-Type": "application/json",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // const payload = {formData, scheduleEnabled, timeOfDay, beginDate};

      const dataToSend = formData;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/announcement`,
        {
          method: "POST",
          headers: emailFormHeaders,
          // body: JSON.stringify(payload),
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        // Handle successful response here, e.g., show a success message or redirect
        console.log("Email sent successfully");
        setFormData({ subject: "", content: "" });
        router.push(`/public/sent`);
      } else {
        // Handle error response here, e.g., show an error message
        console.log("Error sending email");
      }

      setQuickBroadcastModal(false);
      resetScheduleVariables();
    } catch (error) {
      // Handle any unexpected errors here
      console.log("An error occurred:\n", error);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // maybe: get copy of subject + content and update both whenever one changes?
    const subject = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      subject: subject,
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      content: content,
    }));
  };

  const handleJobPostingServiceSubmit = async (event: React.FormEvent) => {
    const payload = {
      scheduleEnabled,
      frequency,
      dayOfWeek,
      dayOfMonth,
      timeOfDay,
      beginDate,
      endDate,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcast`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      setJobPostingModal(false);
      resetScheduleVariables();
    } catch (err) {
      console.error("Failed to submit service", err);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h5 className="text-2xl tracking-tight mb-3 text-gray-500 dark:text-white">
          Prepare a new broadcast/service
        </h5>
        <div className="flex flex-row mb-6 gap-6">
          <Card
            href="#"
            className="h-48 min-w-[24rem] max-w-[24rem] transform transition-transform active:opacity-80"
            onClick={() => setQuickBroadcastModal(true)}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Quick broadcast
              <br />
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Quickly craft and send an email to brothers.
            </p>
          </Card>
          <Card
            href="#"
            className="h-48 min-w-[24rem] max-w-[24rem] transform transition-transform active:opacity-80"
            onClick={() => setJobPostingModal(true)}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Configure a job posting <br /> email service
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Configure an email service that automatically sends job posting
              emails to brothers.
            </p>
          </Card>
        </div>

        <h5 className="text-2xl tracking-tight mb-3 text-gray-500 dark:text-white">
          Running services
        </h5>
        <div className="flex flex-row mb-6 gap-6">
          <Card
            href="#"
            className="h-48 min-w-[24rem] max-w-[24rem] transform transition-transform active:opacity-80"
            // onClick={() => setQuickBroadcastModal(true)}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Service 1
              <br />
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Running since 2023-10-01
            </p>
          </Card>
        </div>
      </div>

      {/* Job Posting Service */}
      <Modal
        show={openJobPostingModal}
        className="w-full"
        onClose={() => {
          setJobPostingModal(false);
          resetScheduleVariables();
        }}
        popup
      >
        <ModalHeader className="mt-2 pl-6 pr-6 item-center">
          Job Posting Email Service
        </ModalHeader>
        <ModalBody className="flex flex-col items-center px-6 overflow-x-hidden">
          <h2 className="w-full mb-1">Email Content</h2>
          <hr className="w-full border-gray-200 dark:border-gray-700 mb-2" />
          <h2 className="w-full text-md text-gray-500 dark:text-white mb-4">
            The content will be generated automatically. However, feel free to
            customize the scheduling!
          </h2>
          {/* scheduling toggle */}
          <div className="flex flex-row w-full items-center gap-2">
            <h2 className="w-full mb-2">Email Scheduling</h2>
            <Checkbox
              id="jobPostingSchedule"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.currentTarget.checked)}
            />
          </div>
          <hr className="w-full border-gray-200 dark:border-gray-700 mb-2" />

          {/* Repeat & time */}
          <fieldset
            disabled={!scheduleEnabled}
            className={`flex flex-row w-full items-center gap-2 border-0 ${
              !scheduleEnabled ? "opacity-80 text-gray-500" : ""
            }`}
          >
            Repeat
            <Dropdown label={frequency} inline>
              {["Daily", "Weekly", "Biweekly", "Monthly"].map((d) => (
                <DropdownItem key={d} onClick={() => setFrequency(d)}>
                  {d}
                </DropdownItem>
              ))}
            </Dropdown>
            {frequency === "Daily" && (
              <>
                at
                <input
                  type="time"
                  className="mx-2 w-36 border-none p-0"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
              </>
            )}
            {(frequency === "Weekly" || frequency === "Biweekly") && (
              <>
                every
                <Dropdown label={dayOfWeek} inline>
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((d) => (
                    <DropdownItem key={d} onClick={() => setDayOfWeek(d)}>
                      {d}
                    </DropdownItem>
                  ))}
                </Dropdown>
                at
                <input
                  type="time"
                  className="mx-2 w-36 border-none p-0"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
              </>
            )}
            {frequency === "Monthly" && (
              <>
                on day
                <div className="max-h-32 overflow-y-auto">
                  <Dropdown
                    label={`${dayOfMonth}`}
                    inline
                    theme={{
                      floating: {
                        base: `z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none max-h-72 overflow-y-auto`,
                        content:
                          "py-1 text-sm text-gray-700 dark:text-gray-200",
                      },
                    }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                      <DropdownItem
                        key={num}
                        onClick={() => setDayOfMonth(num)}
                      >
                        {num}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                </div>
                of each month at
                <input
                  type="time"
                  className="mx-2 w-36 border-none p-0"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
              </>
            )}
          </fieldset>

          {frequency === "Monthly" && (
            <div className="flex flex-row w-full items-center justify-start gap-2">
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                If the selected day does not exist that month, the email will be
                sent on the last day of that month.
              </p>
            </div>
          )}

          {/* Date range pickers */}
          <fieldset
            disabled={!scheduleEnabled}
            className={`flex w-full justify-center gap-2 mb-6 border-0 ${
              !scheduleEnabled ? "opacity-80 text-gray-500" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <Datepicker
                disabled={!scheduleEnabled}
                title="Starting date"
                minDate={now}
                inline
                onSelectedDateChanged={(date: Date) => {
                  console.log("picked start date:", date);
                  setBeginDate(date);
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <Datepicker
                disabled={!scheduleEnabled}
                minDate={new Date(beginDate)}
                title="End date"
                inline
                onSelectedDateChanged={(date: Date) => {
                  console.log("picked end date:", date);
                  setEndDate(date);
                }}
              />
            </div>
          </fieldset>

          {/* summary message */}
          <h2 className="w-full text-md text-gray-500 dark:text-white mb-6 italic">
            {!scheduleEnabled
              ? `This email will be sent immediately.`
              : frequency === "Daily"
              ? `This email will be sent every day at ${timeFormatter(
                  timeOfDay
                )} (EST), from ${dateFormatter(beginDate)} to ${dateFormatter(
                  endDate
                )} (EST).`
              : frequency === "Weekly"
              ? `This email will be sent every week on ${dayOfWeek} at ${timeFormatter(
                  timeOfDay
                )} (EST), from ${dateFormatter(beginDate)} to ${dateFormatter(
                  endDate
                )} (EST).`
              : frequency === "Biweekly"
              ? `This email will be sent every two weeks on ${dayOfWeek} at ${timeFormatter(
                  timeOfDay
                )} (EST), from ${dateFormatter(beginDate)} to ${dateFormatter(
                  endDate
                )} (EST).`
              : frequency === "Monthly"
              ? `This email will be sent on day ${dayOfMonth} of every month at ${timeFormatter(
                  timeOfDay
                )} (EST), from ${dateFormatter(beginDate)} to ${dateFormatter(
                  endDate
                )} (EST).`
              : ""}
          </h2>

          {/* action buttons */}
          <div className="flex flex-row gap-4">
            {!scheduleEnabled ? (
              <Button onClick={handleJobPostingServiceSubmit}>
                Send Immedieately
              </Button>
            ) : (
              <Button onClick={handleJobPostingServiceSubmit}>
                Launch Scheduled Service
              </Button>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* Quick broadcast */}
      <Modal
        show={openQuickBroadcastModal}
        className="w-full"
        onClose={() => {
          setQuickBroadcastModal(false);
          resetScheduleVariables();
        }}
        popup
      >
        <ModalHeader className="mt-2 pl-6 pr-6 item-center">
          Quick Broadcast
        </ModalHeader>
        <ModalBody className="flex flex-col items-center px-6 overflow-x-hidden">
          <h2 className="w-full mb-1">Email Content</h2>
          <hr className="w-full border-gray-200 dark:border-gray-700 mb-2" />
          <h2 className="w-full text-md text-gray-500 dark:text-white">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  className="border-rounded rounded-md"
                  value={formData.subject}
                  // onChange either takes an event and passes the information to handleChange to update formData,
                  // or it passes the event to handleChange, which parses it and updates formData
                  onChange={handleSubjectChange}
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="body">Email Body:</label>
                <textarea
                  id="body"
                  className="border-rounded rounded-md min-h-[10rem]"
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </div>
              <h2 className="w-full text-md text-gray-500 dark:text-white">
                No need to worry about formatting. The email body will be
                automatically formatted in the final email.
              </h2>
              <div className="flex flex-row w-full items-center gap-2 mt-4">
                <h2 className="w-full mb-1 text-black">Email scheduling</h2>
                <Checkbox
                  id="accept"
                  checked={scheduleEnabled}
                  onChange={(e) => setScheduleEnabled(e.currentTarget.checked)}
                />
              </div>
              <hr className="w-full border-gray-200 dark:border-gray-700 mb-2" />
              <fieldset
                disabled={!scheduleEnabled}
                className={`flex w-full justify-start gap-4 mb-6 border-0 ${
                  !scheduleEnabled ? "opacity-80" : "text-black"
                }`}
              >
                <div className="flex flex-row items-center">
                  Send on
                  <Datepicker
                    disabled={!scheduleEnabled}
                    title="Send date"
                    className="mx-2"
                    minDate={now}
                    theme={{
                      popup: {
                        root: {
                          // position the popup *above* the input
                          base: "absolute bottom-full mb-2 z-50 block pt-2",
                        },
                      },
                    }}
                    onSelectedDateChanged={(date: Date) => setBeginDate(date)}
                  />
                  at
                  <input
                    type="time"
                    className="mx-2 w-36 border-none p-0"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
              </fieldset>
              {scheduleEnabled && (
                <h2 className="w-full text-md text-gray-500 dark:text-white mb-6 italic">
                  This email will be sent on {dateFormatter(beginDate)} at{" "}
                  {timeFormatter(timeOfDay)} (EST).
                </h2>
              )}
              <div className="flex flex-row gap-4 justify-center">
                {!scheduleEnabled && (
                  <Button type="submit">Send Immediately</Button>
                )}
                {scheduleEnabled && (
                  <Button type="submit">Schedule Send</Button>
                )}
              </div>
            </form>
          </h2>
        </ModalBody>
      </Modal>
    </>
  );
}
