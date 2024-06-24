import { EventFormData } from "@/app/admin/rush/page";
import { RushCategory } from "@/types/admin/events";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";

interface EventModalProps {
	showModal: boolean,
	selectedRushCategory: RushCategory | null,
	eventFormData: EventFormData,
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
	setEventFormData,
	onClose,
	onSubmit,
	modifyingEvent,
}: EventModalProps) {
	return (
		<Modal show={showModal} size="md" onClose={onClose} popup>
			<Modal.Header />
			<Modal.Body>
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						{modifyingEvent ? `Modify Event` : `Create an Event for "${selectedRushCategory?.name}"` } 
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
							onChange={(e) => setEventFormData({...eventFormData, eventName: e.target.value})} 
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
							onChange={(e) => setEventFormData({...eventFormData, eventCode: e.target.value})} 
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="eventCode" value="Event Deadline" />
							<span className="text-red-500"> *</span>
						</div>
						<DatePicker
							selected={eventFormData.eventDeadline}
							onChange={(date: Date) => setEventFormData({...eventFormData, eventDeadline: date})}
							showTimeSelect
							isClearable
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="MMMM d, yyyy h:mm aa"
							className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
							wrapperClassName="w-full" // Add a custom class to make it full width
						/>
					</div>
					<div className="w-full">
						<Button 
							disabled={!eventFormData.eventName || !eventFormData.eventCode || !eventFormData.eventDeadline}
							onClick={onSubmit}>
								{modifyingEvent ? "Modify Event" : "Create Event"}
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}