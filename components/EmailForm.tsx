'use client'  // what does this mean
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EmailFormData {
  subject: string,
  content: string
}

const initialValues: EmailFormData = {
  subject: '',
  content: ''
};

// useless for first pass

// interface EmailFormProps {
//   title: string | null,
//   emailID: string | null;
// }

export default function EmailForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmailFormData>(initialValues);

  // TODO: auto-format HTML????

  const emailFormHeaders = new Headers({
    'Content-Type': 'application/json',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const dataToSend = formData

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcement`, {
        method: 'POST',
        headers: emailFormHeaders,
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Handle successful response here, e.g., show a success message or redirect
        console.log('Email sent successfully');
        setFormData({ subject: '', content: '' });
        router.push(`/public/sent`);
      } else {
        // Handle error response here, e.g., show an error message
        console.log('Error sending email');
      }
    } catch (error) {
      // Handle any unexpected errors here
      console.log('An error occurred:\n', error);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // maybe: get copy of subject + content and update both whenever one changes?
    const subject = e.target.value
    setFormData((prevData) => ({
      ...prevData,
      subject: subject,
    }))
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setFormData((prevData) => ({
      ...prevData,
      content: content,
    }))
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          // onChange either takes an event and passes the information to handleChange to update formData, 
          // or it passes the event to handleChange, which parses it and updates formData
          onChange={handleSubjectChange}
        />
      </div>

      <div>
        <label htmlFor="body">Email Body:</label>
        <textarea
          id="body"
          value={formData.content}
          onChange={handleContentChange}
        />
      </div>
      <div>
        <button type="submit">Send Email</button>
      </div>
    </form>
  )
}