"use client"
import React, { useState, useEffect } from 'react';
import AddAlumniForm from './AddAlumniForm';

const Alumni = () => {
    const [alumniData, setAlumniData] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    
    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchAlumniData();
    }, []);

    const openForm = () => {
    setFormOpen(true);
    };

    const closeForm = () => {
    setFormOpen(false);
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
        // Perform the logic to send the data to your backend and create the alumni
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
        } else {
          console.error('Failed to create alumni');
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Major</th>
                        <th>Company</th>
                        <th>Year</th>
                        <th>Contact</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {alumniData.map((alumni) => (
                        <tr key={alumni.id}>
                            <td>{alumni.name}</td>
                            <td>{alumni.major}</td>
                            <td>{alumni.company}</td>
                            <td>{alumni.year}</td>
                            <td>{alumni.contact}</td>
                            <td>
                                <button onClick={() => handleDelete(alumni.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={openForm}>Add Alumni</button>
                <AddAlumniForm isOpen={isFormOpen} onClose={closeForm} onCreate={handleCreateAlumni} />
            </div>
        </div>
    );
};

export default Alumni;