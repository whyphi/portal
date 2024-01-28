"use client"
import React, { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';

const Alumni = () => {
    const [alumniData, setAlumniData] = useState([]);

    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchAlumniData();
    }, []);

    const initialFormData = {
        name: '',
        major: '',
        company: '',
        graduationYear: '',
        contact: '',
    };

    const [inputValues, setInputValues] = useState(initialFormData);

    //validation logic
    const validateNameMajor = (value) => /^[a-zA-Z\s]+$/.test(value);
    const validateGraduationYear = (value) => /^[0-9]*$/.test(value);

    const handleInputChange = (column, value) => {
        let isValidInput = true;

        // Validation logic based on the input column
        switch (column) {
        case 'name':
        case 'major':
            isValidInput = validateNameMajor(value);
            break;
        case 'graduationYear':
            isValidInput = validateGraduationYear(value);
            break;
        default:
            break;
        }

        // Update the state only if the input is valid
        if (isValidInput || value === '') {
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [column]: value,
        }));
        }
  };

    const fetchAlumniData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alumni`);
            const data = await response.json();
            setAlumniData(data);
        } catch (error) {
            console.error('Error fetching alumni data:', error);
        }
    };

    const handleDelete = async (id:string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alumni/${id}`, {   
                method: 'DELETE',
            });
            // Refresh data after deletion
            fetchAlumniData();
        } catch (error) {
            console.error('Error deleting alumni:', error);
        }
    };

    const handleCreateAlumni = async (formData) => {
        // Check if any of the fields are empty
        const isEmptyField = Object.values(formData).some(value => value.trim() === '');

        if (isEmptyField) {
            console.error('Please fill in all fields before submitting.');
        return;
        }

        // Perform the logic to send the data to backend and create the alumni
        console.log('Creating alumni:', formData);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alumni`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        // Refresh data after creation
        fetchAlumniData();
        if (response.ok) {
          console.log('Alumni created successfully');
          setInputValues(initialFormData);
        } else {
          console.error('Failed to create alumni');
        }
    };

    return (
        <div>
            <div className="overflow-x-auto">
            <Table>
            <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Major</Table.HeadCell>
                <Table.HeadCell>Company</Table.HeadCell>
                <Table.HeadCell>Graduation Year</Table.HeadCell>
                <Table.HeadCell>Contact</Table.HeadCell>
                <Table.HeadCell>
                <span className="sr-only">Edit</span>
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
            {alumniData.map((alumni) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {alumni.name}
                    </Table.Cell>
                    <Table.Cell>{alumni.major}</Table.Cell>
                    <Table.Cell>{alumni.company}</Table.Cell>
                    <Table.Cell>{alumni.graduationYear}</Table.Cell>
                    <Table.Cell>{alumni.contact}</Table.Cell>
                    <Table.Cell>
                        <button className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => handleDelete(alumni.id)}>Delete</button>
                    </Table.Cell>
                </Table.Row>
                ))}
                
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <input
                        type="text"
                        value={inputValues.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-24" // Set the width to 4rem (adjust as needed)
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <input
                        type="text"
                        value={inputValues.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        className="w-24" // Set the width to 4rem (adjust as needed)
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <input
                        type="text"
                        value={inputValues.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-24" // Set the width to 4rem (adjust as needed)
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <input
                        type="text"
                        value={inputValues.graduationYear}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        className="w-24" // Set the width to 4rem (adjust as needed)
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <input
                        type="text"
                        value={inputValues.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        className="w-24" // Set the width to 4rem (adjust as needed)
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleCreateAlumni(inputValues)}
                        >
                        Add Alumni
                        </button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
            </Table>
            </div>
      </div>
    );
};

export default Alumni;