"use client"

import React, { useState, useEffect } from 'react';
import { Alert } from 'flowbite-react';


interface AlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ message, onClose }) => {

  return (
    // <div className={`fixed top-0 left-0 right-0 z-50 ${visible ? 'block' : 'hidden'}`}>
    // </div>
    <div className="fixed">
      <Alert color="success">
        <span className="font-medium">Success: </span>{message}
      </Alert>

    </div>
  );
};

export default CustomAlert;
