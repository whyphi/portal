"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  Datepicker,
} from "flowbite-react";

export interface JobPostingServiceModalProps {
  open: boolean;
  onClose: () => void;
  scheduleEnabled: boolean;
  frequency: string;
  setFrequency: (value: string) => void;
  dayOfWeek: string;
  setDayOfWeek: (value: string) => void;
  dayOfMonth: number;
  setDayOfMonth: (value: number) => void;
  timeOfDay: string;
  setTimeOfDay: (value: string) => void;
  beginDate: Date;
  setBeginDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  dateFormatter: (date: Date) => string;
  timeFormatter: (time: string) => string;
  now: Date;
  handleJobPostingServiceSubmit: () => void;
}

const JobPostingServiceModal: React.FC<JobPostingServiceModalProps> = ({
  open,
  onClose,
  scheduleEnabled,
  frequency,
  setFrequency,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  timeOfDay,
  setTimeOfDay,
  beginDate,
  setBeginDate,
  endDate,
  setEndDate,
  dateFormatter,
  timeFormatter,
  now,
  handleJobPostingServiceSubmit,
}) => {
  return (
    <Modal show={open} className="w-full" onClose={onClose} popup>
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
        {/* Scheduling toggle */}
        <div className="flex flex-row w-full items-center gap-2">
          <h2 className="w-full mb-2">Email Scheduling</h2>
          <Checkbox
            id="jobPostingSchedule"
            checked={scheduleEnabled}
            onChange={(e) => {
              // Note: if you need to update scheduleEnabled here, add a setter prop.
              // For now, assume the parent handles this.
            }}
          />
        </div>
        <hr className="w-full border-gray-200 dark:border-gray-700 mb-2" />
        {/* Repeat & time settings */}
        <fieldset
          disabled={!scheduleEnabled}
          className={`flex flex-row w-full items-center gap-2 border-0 ${
            !scheduleEnabled ? "opacity-80 text-gray-500" : ""
          }`}
        >
          <span>Repeat</span>
          <Dropdown label={frequency || "Select"} inline>
            {["Daily", "Weekly", "Biweekly", "Monthly"].map((d) => (
              <DropdownItem key={d} onClick={() => setFrequency(d)}>
                {d}
              </DropdownItem>
            ))}
          </Dropdown>
          {frequency === "Daily" && (
            <>
              <span>at</span>
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
              <span>every</span>
              <Dropdown label={dayOfWeek || "Select"} inline>
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
              <span>at</span>
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
              <span>on day</span>
              <div className="max-h-32 overflow-y-auto">
                <Dropdown
                  label={dayOfMonth === 0 ? "Select" : dayOfMonth.toString()}
                  inline
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                    <DropdownItem key={num} onClick={() => setDayOfMonth(num)}>
                      {num}
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
              <span>of each month at</span>
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
                setBeginDate(date);
              }}
            />
          </div>
          <div className="flex flex-col items-center">
            <Datepicker
              disabled={!scheduleEnabled}
              minDate={beginDate}
              title="End date"
              inline
              onSelectedDateChanged={(date: Date) => {
                setEndDate(date);
              }}
            />
          </div>
        </fieldset>

        {/* Summary message */}
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

        {/* Action buttons */}
        <div className="flex flex-row gap-4">
          {!scheduleEnabled ? (
            <Button onClick={handleJobPostingServiceSubmit}>
              Send Immediately
            </Button>
          ) : (
            <Button onClick={handleJobPostingServiceSubmit}>
              Launch Scheduled Service
            </Button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default JobPostingServiceModal;
