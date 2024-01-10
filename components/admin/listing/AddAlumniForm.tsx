"use client"
import React, { useState } from 'react';
import Modal from 'react-modal';

const AddAlumniForm = ({ isOpen, onClose, onCreate }) => {
    const initialFormData = {
        name: '',
        major: '',
        company: '',
        graduationYear: '',
        contact: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        // Trigger the create method and pass the form data
        onCreate(formData);
        //reset form data
        setFormData(initialFormData);
        // Close the modal
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Add Alumni</h2>
                    <form>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Major:
                            <input
                                type="text"
                                name="major"
                                value={formData.major}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Company:
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Year:
                            <input
                                type="text"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Contact:
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <button
                            type="button"
                            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Modal >
    );
};

export default AddAlumniForm;
