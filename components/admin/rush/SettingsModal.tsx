import { EventTimeframeRush } from "@/types/admin/events";
import { Button, Dropdown, Label, Modal } from "flowbite-react";
import { useState } from "react";

interface SettingsModalProps {
	showModal: boolean,
	defaultRushTimeframeId: string,
  rushTimeframes: EventTimeframeRush[],
	onClose: () => void,
	onSubmit: (defaultRushTimeframeId: string) => Promise<void>,
}

// SettingsModal: used to select/update the defaultRushTimeframeId (TODO: delete rushTimeframes here too)
export default function SettingsModal({
	showModal,
	defaultRushTimeframeId: defaultRushTimeframeId,
	rushTimeframes: rushTimeframes,
	onClose,
	onSubmit,
}: SettingsModalProps) {
	const [localDefaultRushTimeframeId, setLocalDefaultRushTimeframeId] = useState(defaultRushTimeframeId);

	const timeframes = rushTimeframes.map((timeframe) => {
		return { label: timeframe.name, value: timeframe.id }
	});

	const getRushTimeframeById = (timeframeId: string | null): string => {
		const timeframe = rushTimeframes.find((timeframe) => timeframe.id === timeframeId);
		if (timeframe) {
			return timeframe.name;
		} else {
			return "None";
		}
	}

	return (
		<Modal show={showModal} size="md" onClose={onClose} popup>
			<Modal.Header className="dark:bg-background-dark" />
			<Modal.Body className="dark:bg-background-dark">
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						Rush Settings
					</h3>

					<div>
						<div className="mb-2 block">
							<Label htmlFor="defaultRushTimeframeId" value="Default Rush Timeframe" />
							<span className="text-red-500"> *</span>
						</div>
						<Dropdown label={getRushTimeframeById(localDefaultRushTimeframeId)} color="gray">
							<Dropdown.Item onClick={() => setLocalDefaultRushTimeframeId("")}>
								None
							</Dropdown.Item>
							<Dropdown.Divider />
							{timeframes.map((timeframe) => (
                <Dropdown.Item key={timeframe.value} onClick={() => setLocalDefaultRushTimeframeId(timeframe.value)}>
                  {timeframe.label}
                </Dropdown.Item>
              ))}
						</Dropdown>
					</div>

					<div className="w-full">
						<Button
							// disabled={}
							onClick={() => onSubmit(localDefaultRushTimeframeId)}
						>
							Update Settings
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}