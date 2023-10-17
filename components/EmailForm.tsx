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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // API call to SES endpoint
    setFormData({ subject: '', content: '' });
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