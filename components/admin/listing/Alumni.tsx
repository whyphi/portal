"use client"
import { useEffect, useState } from "react";

export default function Alumni() {
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/alumni`)
          .then((response) => response.json())
          .then((response) => console.log(response))
          .catch((error) => console.error("Error fetching listings:", error));
      }, []);
    return (
        
        <div>Hello World</div>
    )
}