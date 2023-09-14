"use client"
import Form from "@/components/Form"
import { useEffect } from "react"


export default function Home() {

  useEffect(() => {
    console.log("hello")
  })

  return (
    <main className="flex flex-col mx-auto justify-center items-center max-w-screen-sm px-5 py-2.5">
      <Form />
    </main>
  )
}
