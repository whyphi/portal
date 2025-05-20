"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Datepicker,
  Button,
  Checkbox,
} from "flowbite-react";

export interface EmailFormData {
  subject: string;
  content: string;
}

interface QuickBroadcastProps {
  open: boolean;
  onClose: () => void;
  formData: EmailFormData;
  handleSubjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  scheduleEnabled: boolean;
  setScheduleEnabled: (enabled: boolean) => void;
  beginDate: Date;
  setBeginDate: (date: Date) => void;
  timeOfDay: string;
  setTimeOfDay: (time: string) => void;
  now: Date;
  dateFormatter: (date: Date) => string;
  timeFormatter: (time: string) => string;
}

const QuickBroadcast: React.FC<QuickBroadcastProps> = ({
  open,
  onClose,
  formData,
  handleSubjectChange,
  handleContentChange,
  handleSubmit,
  scheduleEnabled,
  setScheduleEnabled,
  beginDate,
  setBeginDate,
  timeOfDay,
  setTimeOfDay,
  now,
  dateFormatter,
  timeFormatter,
}) => {
  return (
    <Modal show={open} className="w-full" onClose={onClose} popup>
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
              {!scheduleEnabled ? (
                <Button type="submit">Send Immediately</Button>
              ) : (
                <Button type="submit">Schedule Send</Button>
              )}
            </div>
          </form>
        </h2>
      </ModalBody>
    </Modal>
  );
};

export default QuickBroadcast;
