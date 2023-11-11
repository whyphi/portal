"use client"

import { Spinner } from 'flowbite-react';

export default function Loader() {

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner
        aria-label="Purple spinner"
        color="purple"
        size="xl"
      />
    </div>
  )
}
