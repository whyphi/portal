import { RushCategory } from "@/types/admin/events";
import { Button, Dropdown, Label, Modal } from "flowbite-react";
import { useState } from "react";

interface SettingsModalProps {
	showModal: boolean,
	defaultRushCategoryId: string | null,
  rushCategories: RushCategory[],
	onClose: () => void,
	onSubmit: (defaultRushCategoryId: string | null) => Promise<void>,
}

// SettingsModal: used to select/update the defaultRushCategoryId (TODO: delete rushCategories here too)
export default function SettingsModal({
	showModal,
	defaultRushCategoryId,
	rushCategories,
	onClose,
	onSubmit,
}: SettingsModalProps) {
	const [localDefaultRushCategoryId, setLocalDefaultRushCategoryId] = useState(defaultRushCategoryId);

	const categories = rushCategories.map((category) => {
		return { label: category.name, value: category._id }
	});

	const getRushCategoryById = (categoryId: string | null): string => {
		const category = rushCategories.find((category) => category._id === categoryId);
		if (category) {
			return category.name;
		} else {
			return "None";
		}
	}

	return (
		<Modal show={showModal} size="md" onClose={onClose} popup>
			<Modal.Header />
			<Modal.Body>
				<div className="space-y-6">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						Rush Settings
					</h3>

					<div>
						<div className="mb-2 block">
							<Label htmlFor="defaultRushCategoryId" value="Default Rush Category" />
							<span className="text-red-500"> *</span>
						</div>
						<Dropdown label={getRushCategoryById(localDefaultRushCategoryId)} color="gray">
							<Dropdown.Item onClick={() => setLocalDefaultRushCategoryId(null)}>
								None
							</Dropdown.Item>
							<Dropdown.Divider />
							{categories.map((category) => (
                <Dropdown.Item key={category.value} onClick={() => setLocalDefaultRushCategoryId(category.value)}>
                  {category.label}
                </Dropdown.Item>
              ))}
						</Dropdown>
					</div>

					<div className="w-full">
						<Button
							// disabled={}
							onClick={() => onSubmit(localDefaultRushCategoryId)}
						>
							Update Settings
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}