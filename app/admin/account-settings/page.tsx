"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth, getUserId } from "@/app/contexts/AuthContext";
import { Button, Card, Select, Label, TextInput } from "flowbite-react";
import { Member } from "@/types/admin/account-settings/member";

export default function AccountSettings() {
  const { token } = useAuth();
  const _id = getUserId();
  const router = useRouter();

  const [user, setUser] = useState<Member>({} as Member);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/member/${_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [_id, token]); // Include _id and token in the dependency array

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.id]: event.target.value
    }));
  }


  const textStyles = {
    title: "text-2xl font-bold dark:text-white mb-2 mt-4",
    subtitle: "mb-2 text-lg font-normal font-semibold ",
  };

  return (
    <div>
      <Card className="max-w">
        <h1 className={textStyles.title}>Account Settings</h1>
        <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault();
          console.log(user);
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/member/${_id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
          })
            .then(() => router.push("/admin"))
            .catch(console.error);
        }}>

          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className={textStyles.subtitle}>Personal Information</h4>

            {/* Name and Email */}
            <div className="flex flex-row mb-4">
              <div className="w-1/2 pr-2">
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Name" />
                </div>
                <TextInput id="name" type="text" placeholder="John Doe" value={user?.name ?? ""} required onChange={handleInputChange} />
              </div>
              <div className="w-1/2 pl-2">
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput disabled={true} id="email" type="email" placeholder="whyphi@bu.edu" value={user?.email ?? ""} required />
              </div>
            </div>

            {/* Graduation Year and College */}
            <div className="flex flex-row mb-4">
              <div className="w-1/2 pr-2">
                <div className="mb-2 block">
                  <Label htmlFor="graduationYear" value="Graduation Year" />
                </div>
                <TextInput id="graduationYear" type="text" placeholder="Graduation Year" value={user?.graduationYear ?? ""} required onChange={handleInputChange} />
              </div>
              <div className="w-1/2 pl-2">
                <div className="mb-2 block">
                  <Label htmlFor="college" value="College" />
                </div>
                <Select id="college" required onChange={handleInputChange} value={user?.college ?? ""}>
                  <option value="CAS">CAS – College of Arts & Sciences</option>
                  <option value="Pardee">Pardee - The Frederick S. Pardee School of Global Studies</option>
                  <option value="QST">QST - Questrom School of Business</option>
                  <option value="COM">COM - College of Communication</option>
                  <option value="ENG">ENG - College of Engineering</option>
                  <option value="CFA">CFA - College of Fine Arts</option>
                  <option value="CDS">CDS -  Faculty of Computing & Data Sciences </option>
                  <option value="CGS">CGS - College of General Studies</option>
                  <option value="Sargent">Sargent - Sargent College of Health and Rehabilitation Sciences</option>
                  <option value="SHA">SHA - School of Hospitality Administration</option>
                  <option value="Wheelock">Wheelock - Wheelock College of Education and Human Development</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>

            {/* Major and Minor */}
            <div className="flex flex-row">
              <div className="w-1/2 pr-2">
                <div className="mb-2 block">
                  <Label htmlFor="major" value="Major" />
                </div>
                <TextInput id="major" type="text" placeholder="Major" value={user?.major ?? ""} required onChange={handleInputChange} />
              </div>
              <div className="w-1/2 pl-2">
                <div className="mb-2 block">
                  <Label htmlFor="minor" value="Minor" />
                </div>
                <TextInput id="minor" type="text" placeholder="Minor" value={user?.minor ?? ""} onChange={handleInputChange} />
              </div>
            </div>


          </div>

          {/* PCT-related Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className={textStyles.subtitle}>PCT-related Information</h4>

            {/* Class and Family */}
            <div className="flex flex-row mb-4">
              <div className="w-1/2 pr-2">
                <div className="mb-2 block">
                  <Label htmlFor="class" value="Class" />
                </div>
                <TextInput id="class" type="text" placeholder="Class" value={user?.class ?? ""} required onChange={handleInputChange} />
              </div>

              <div className="w-1/2 pl-2">
                <div className="mb-2 block">
                  <Label htmlFor="family" value="Family" />
                </div>
                <TextInput id="family" type="text" placeholder="Family" value={user?.family ?? ""} required onChange={handleInputChange} />
              </div>
            </div>

            {/* Team and Big */}
            <div className="flex flex-row mb-4">
              <div className="w-1/2 pr-2">
                <div className="mb-2 block">
                  <Label htmlFor="team" value="Team" />
                </div>
                <Select id="team" required onChange={handleInputChange} value={user.team ?? ""}>
                  <option value="recruitment">Recruitment</option>
                  <option value="marketing">Marketing</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="fundraising">Fundraising</option>
                  <option value="finance">Finance</option>
                  <option value="technology">Technology</option>
                  <option value="operations">Operations</option>
                  <option value="other">Other</option>
                </Select>

              </div>

              <div className="w-1/2 pl-2">
                <div className="mb-2 block">
                  <Label htmlFor="big" value="Big" />
                </div>
                <TextInput id="big" type="text" placeholder="Big" value={user?.big ?? ""} required onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Card>
    </div>
  )
}
