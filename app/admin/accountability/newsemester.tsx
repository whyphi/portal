"use client"
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import './newsemester.css';


const CreateSemester: React.FC<{
    isOpen: boolean;
    onClose: () => void;
  }> = ({ isOpen, onClose }) => {
    const router = useRouter();
        
    const semester = useRef<HTMLInputElement>(null);
    const year = useRef<HTMLInputElement>(null);
    const link = useRef<HTMLInputElement>(null);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const yearValue = parseInt(year.current?.value || '0', 10);
            if (isNaN(yearValue)) {
                throw new Error('Please enter a valid year.');
            }
            
            let fullsemester = yearValue + semester.current!.value;
            const listid = 1;
            const dataToSend = {
            id: listid,
            semester: fullsemester,
            link: link.current?.value,
            };
    
            // Make a POST request to the /submit API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/semester`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
            });
    
            if (response.ok) {
            // Handle successful response here, e.g., show a success message or redirect
            console.log('Semester created successfully');
            router.push(`/public/success`);
            } else {
            // Handle error response here, e.g., show an error message
            console.error('Error creating semester');
            }
        } catch (error) {
            // Handle any unexpected errors here
            console.error('An error occurred:', error);
        }
    }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
        <div className="overlay">
            <form id="modal"onSubmit={submitHandler}>
                <label>
                    Semester:
                    <input type='text' ref={semester} />
                </label>
                <br></br>
                <label>
                    Year:
                    <input type='text' ref={year} />
                </label>
                <br></br>
                <label>
                    Link:
                    <input type='text' ref={link} />
                </label>
                <br></br>
                <button>Create New Semester</button>
            </form>
        </div>
    </Modal >
  );

};

export default CreateSemester;
