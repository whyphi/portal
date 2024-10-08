import { EventFormData } from "@/app/admin/rush/page";
import { RushCategory } from "@/types/admin/events";
import { addTwoHours } from "@/utils/date";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import DatePicker from "react-datepicker";
import CropImage from "./Image/CropImage";
import { AdminTextStyles } from "@/styles/TextStyles";
import { useEffect } from "react";

interface EventModalProps {
	showModal: boolean,
	selectedRushCategory: RushCategory | null,
	eventFormData: EventFormData,
	isSubmitting: boolean,
	setEventFormData: React.Dispatch<React.SetStateAction<EventFormData>>,
	onClose: () => void,
	onSubmit: () => void,
	modifyingEvent?: boolean,
}

// EventModel: can be used to either create or update events (by default, it is set to "creating" an event)
export default function EventModal({
	showModal,
	selectedRushCategory,
	eventFormData,
	isSubmitting,
	setEventFormData,
	onClose,
	onSubmit,
	modifyingEvent,
}: EventModalProps) {

	// helper function (to increment eventCoverImageVersion)
	const incrementVersion = (version: string) => {
		const intVersion = parseInt(version.slice(1)) + 1
		return`v${intVersion}`;
	};

	// if modifying, increment eventCoverImageVersion
	useEffect(() => {
		modifyingEvent && setEventFormData((prevEventFormData) => ({
			...prevEventFormData, 
			eventCoverImageVersion: incrementVersion(prevEventFormData.eventCoverImageVersion)
		}));
	}, [modifyingEvent])

	return (
		<Modal  show={showModal} size="2xl" onClose={onClose} popup>
			<Modal.Header className="dark:bg-background-dark" />
			<Modal.Body className="dark:bg-background-dark">
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						{modifyingEvent ? `Modify Event` : `Create an Event for "${selectedRushCategory?.name}"`}
					</h3>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventName" value="Event Name" />
							<span className="text-red-500"> *</span>
						</div>
						<TextInput
							id="eventName"
							type="text"
							required
							value={eventFormData.eventName}
							onChange={(e) => setEventFormData({ ...eventFormData, eventName: e.target.value })}
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventCoverImage" value="Event Cover Image" />
							<span className="text-red-500"> *</span>
						</div>
						<CropImage 
							eventCoverImage={eventFormData.eventCoverImage}
							eventCoverImageName={eventFormData.eventCoverImageName}
							onChange={
								([eventCoverImage, eventCoverImageName]) => 
									setEventFormData({ ...eventFormData, eventCoverImage, eventCoverImageName})
							} 
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventCode" value="Event Code" />
							<span className="text-red-500"> *</span>
						</div>
						<TextInput
							id="eventCode"
							type="text"
							required
							value={eventFormData.eventCode}
							onChange={(e) => setEventFormData({ ...eventFormData, eventCode: e.target.value })}
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventCode" value="Event Location" />
							<span className="text-red-500"> *</span>
						</div>
						<TextInput
							id="eventLocation"
							type="text"
							required
							value={eventFormData.eventLocation}
							onChange={(e) => setEventFormData({ ...eventFormData, eventLocation: e.target.value })}
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventDate" value="Event Date" />
							<span className="text-red-500"> *</span>
						</div>
						<DatePicker
							selected={eventFormData.eventDate}
							onChange={(date: Date) =>
								setEventFormData({
									...eventFormData,
									eventDate: date,
									...(date && { eventDeadline: addTwoHours(date) })
								})
							}
							showTimeSelect
							isClearable
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="MMMM d, yyyy h:mm aa"
							className={`w-full ${AdminTextStyles.datepicker}`}
							wrapperClassName="w-full"
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventDeadline" value="Event Deadline" />
							<span className="text-red-500"> *</span>
						</div>
						<DatePicker
							selected={eventFormData.eventDeadline}
							onChange={(date: Date) => setEventFormData({ ...eventFormData, eventDeadline: date })}
							showTimeSelect
							isClearable
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="MMMM d, yyyy h:mm aa"
							className={`w-full ${AdminTextStyles.datepicker}`}
							wrapperClassName="w-full"
						/>
					</div>
					<div className="w-full">
						<Button
							disabled={
								!eventFormData.eventName ||
								!eventFormData.eventCode ||
								!eventFormData.eventDate ||
								!eventFormData.eventDeadline ||
								!eventFormData.eventLocation ||
								!eventFormData.eventCoverImage ||
								isSubmitting
							}
							isProcessing={isSubmitting}
							processingSpinner={isSubmitting && <AiOutlineLoading className="h-6 w-6 animate-spin" />}
							onClick={onSubmit}
						>
							{modifyingEvent ? "Modify Event" : "Create Event"}
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}