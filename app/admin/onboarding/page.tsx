"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getSession, useSession } from 'next-auth/react';
import { Timeline, Button, Label, Select, TextInput } from 'flowbite-react';
import { AdminTextStyles } from "@/styles/TextStyles";
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";


interface UserInfo {
  college: string;
  graduationYear: string;
  major: string;
  minor: string;
  class: string;
  team: string;
  family: string;
  isEboard: string;
}

const initUserInfo: UserInfo = {
  college: "",
  graduationYear: "",
  major: "",
  minor: "",
  class: "",
  team: "",
  family: "",
  isEboard: ""
}

export default function Onboarding() {
  const router = useRouter()
  const { token } = useAuth();
  const { data: session, status, update } = useSession()
  console.log(session)

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [currStep, setCurrStep] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>(initUserInfo);

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        setName(session?.user?.name);
        setUserId(session.token._id);
        setUserEmail(session.token.email);
      }
      setIsLoading(false);
    });
  }, []);

  const nextStep = () => {
    setCurrStep(currStep + 1);
  };

  const movePreviousStep = () => {
    setCurrStep(currStep - 1);
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setUserInfo((prevState: UserInfo) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserInfo((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const previousButton = () => {
    return (
      <div className="mb-4">
        <Button size="xs" color="light" pill onClick={movePreviousStep}>
          <HiOutlineArrowLeft className="h-4 w-4 mr-1" />   Back
        </Button>
      </div>
    )
  }

  const handleUserOnboarding = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/onboard/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo)
      });
      if (response.ok) {
        console.log('User info updated successfully');
        await update();
        router.push("/admin");
      } else {
        console.error('Failed to update user info');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  const StepZero = () => {
    return (
      <div>
        <h1 className={AdminTextStyles.title}>Hi {name}!</h1>

        <p className={AdminTextStyles.subparagraph}>To get you started on WhyPhi,</p>
        <p className={AdminTextStyles.paragraph}>{`We're going to be asking some questions.`}</p>

        <Timeline>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#1</Timeline.Time>
              <Timeline.Title>Personal Details</Timeline.Title>
              <Timeline.Body>
                College, Graduation Year
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#2</Timeline.Time>
              <Timeline.Title>PCT-related Information</Timeline.Title>
              <Timeline.Body>
                What class are you in? What team are you a part of? What family are you in?
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>#3</Timeline.Time>
              <Timeline.Title>Check-in QR Code & Next Steps</Timeline.Title>
              <Timeline.Body>
                Save your Check-in QR Code and you should be all set to start using WhyPhi!
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
        <div className="flex flex-row justify-end">
          <Button className="w-28" color="purple" onClick={nextStep}>Next</Button>
        </div>
      </div>
    )
  }

  const StepOne = () => {
    return (
      <div>
        {previousButton()}
        <div>
          <h2 className={AdminTextStyles.subtitle}>Personal Details</h2>
          <p className={AdminTextStyles.subparagraph}>{`We're asking these details so other members can get more information about you through our database!`}</p>
          <div className="mt-4"></div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="colleges" value="Select your college " /><span className="text-red-500">*</span>
            </div>
            <Select id="college" required onChange={handleSelectChange} value={userInfo.college}>
              <option value="">-- Select College</option>
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
            <div className="mb-2 mt-4 block">
              <Label htmlFor="graduationYear" value="Enter your graduation year (20XX) " /><span className="text-red-500">*</span>
            </div>
            <TextInput
              key="graduationYearInput"
              required
              id="graduationYear"
              type="text"
              sizing="md"
              value={userInfo["graduationYear"]}
              onChange={handleInputchange}
            />
            <div className="mb-2 mt-4 block">
              <Label htmlFor="major" value="Major " /><span className="text-red-500">*</span>
            </div>
            <TextInput
              key="majorInput"
              id="major"
              type="text"
              sizing="md"
              value={userInfo["major"]}
              onChange={handleInputchange}
            />
            <div className="mb-2 mt-4 block">
              <Label htmlFor="minor" value="Minor" />
            </div>
            <TextInput
              key="minorInput"
              id="minor"
              type="text"
              sizing="md"
              value={userInfo["minor"]}
              onChange={handleInputchange}
            />
          </div>
          <div className="flex flex-row justify-end mt-8">
            <Button
              className="w-28"
              color="purple"
              onClick={nextStep}
              disabled={userInfo.college === "" || userInfo.graduationYear === "" || userInfo.major === ""}
            >Next</Button>
          </div>
        </div>
      </div>
    )
  }

  const StepTwo = () => {
    return (
      <div>
        {previousButton()}
        <div>
          <h2 className={AdminTextStyles.subtitle}>PCT-related Information</h2>
          <p className={AdminTextStyles.subparagraph}>and... we need a bit more details about you as a member of Phi Chi Theta, Zeta Chapter!</p>
          <div className="mt-4"></div>
          <div className="max-w-md">
            <div className="mb-2 mt-4 block">
              <Label htmlFor="graduationYear" value="What class did you intiate as? " /><span className="text-red-500">*</span>
            </div>
            <TextInput
              key="classInput"
              required
              id="class"
              type="text"
              sizing="md"
              value={userInfo.class}
              onChange={handleInputchange}
            />

            <div className="max-w-md mt-4 mb-2 block">
              <Label htmlFor="team" value="What team are you a part of? " /><span className="text-red-500">*</span>
            </div>
            <Select id="team" required onChange={handleSelectChange} value={userInfo.team}>
              <option value="">-- Select your team</option>
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

            <div className="mb-2 mt-4 block">
              <Label htmlFor="graduationYear" value="What family are you in? " /><span className="text-red-500">*</span>
            </div>
            <TextInput
              key="familyInput"
              required
              id="family"
              type="text"
              sizing="md"
              value={userInfo.family}
              onChange={handleInputchange}
            />

            <div className="max-w-md mt-4 mb-2 block">
              <Label htmlFor="isEboard" value="Are you part of the Executive Board? " /><span className="text-red-500">*</span>
            </div>
            <Select id="isEboard" required onChange={handleSelectChange} value={userInfo.isEboard}>
              <option value="">-- Select yes/no</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>

          </div>
          <div className="flex flex-row justify-end mt-8">
            <Button
              className="w-28"
              color="purple"
              onClick={nextStep}
              disabled={userInfo.class === "" || userInfo.team === "" || userInfo.family === "" || userInfo.isEboard === ""}
            >Next</Button>
          </div>
        </div>
      </div >
    )
  }

  const StepThree = () => {
    return (
      <div>
        {previousButton()}
        <div>
          <h2 className={AdminTextStyles.subtitle}>Check-in QR-Code and Next Steps</h2>
          <p className={AdminTextStyles.subparagraph}>{`This will be your QR-Code to checking in to PCT-related events. You should able to find this QR-Code on the sidebar of the WhyPhi website ☺️`}</p>
          <div className="mt-4"></div>
          <div className="max-w-md">

            {/* https://github.com/zpao/qrcode.react */}
            <QRCodeSVG value={JSON.stringify({ id: userId, email: userEmail })} size={256} />


          </div>

          <p className={AdminTextStyles.subtext}>{`If you have any questions, feel free to reach out to the tech team anytime!`}</p>
          <div className="flex flex-row justify-end mt-8">
            <Button
              className="w-28"
              color="purple"
              onClick={() => handleUserOnboarding()}
              disabled={userInfo.class === "" || userInfo.team === "" || userInfo.family === ""}
            >Get Started</Button>
          </div>
        </div>
      </div >
    )
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      {currStep === 0 ? (StepZero()) : (<></>)}
      {currStep === 1 ? (StepOne()) : (<></>)}
      {currStep === 2 ? (StepTwo()) : (<></>)}
      {currStep === 3 ? (StepThree()) : (<></>)}
    </div>
  );
}
