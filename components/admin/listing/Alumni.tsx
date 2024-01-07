"use client"
import React, { useState, useEffect } from 'react';

const Alumni = () => {
    const [alumniData, setAlumniData] = useState([]);

    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchAlumniData();
    }, []);

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

    // Add similar functions for create and update

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
        </div>
    );
};

export default Alumni;