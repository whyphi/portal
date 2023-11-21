import React from 'react';
import { Spinner } from 'flowbite-react';

export default function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 9999, // Set a high z-index to place it on top
      }}
    >
      <Spinner aria-label="Loader" size="xl" color="purple" />
    </div>
  );
}
