"use client"

import React from 'react';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';


interface AlertProps {
  message: string;
  isError: boolean;
  onClose: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ message, isError, onClose }) => {

  if (isError) {
    return (
      <div className="fixed">
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Error: </span>{message}
        </Alert>
      </div>
    )
  }

  return (
    <div className="fixed">
      <Alert color="success">
        <span className="font-medium">Success: </span>{message}
      </Alert>
    </div>
  );
};

export default CustomAlert;
