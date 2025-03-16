"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  TextInput,
  Label,
  Button,
  Textarea,
  Spinner
} from "flowbite-react";

const NewsletterEditor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    jobs: {},
    events: {}
  });
  const [formData, setFormData] = useState({
    subject: "",
    content: ""
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    setIsLoading(true);
    try {
      // 1) Fetch any existing newsletter data (jobs, events, etc.)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter/data`);
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter data");
      }
      const data = await response.json();
      setNewsletterData(data);
    } catch (error) {
      console.error("Error fetching newsletter data:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 2) Send final newsletter
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Reset form and show success message
        setFormData({ subject: "", content: "" });
        alert("Newsletter sent successfully!");
      } else {
        throw new Error("Failed to send newsletter");
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert("Failed to send newsletter. Please try again.");
    }

    setIsLoading(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFormData((prev) => ({ ...prev, content: newContent }));
    // Update preview with new content
    updatePreview(newContent);
  };

  const updatePreview = async (content: string) => {
    try {
      // 3) Hit the preview endpoint to generate HTML from user content
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        const previewHtml = await response.text();
        setPreview(previewHtml);
      } else {
        console.error("Failed to generate preview");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Section */}
        <Card className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="subject" value="Subject" />
              </div>
              <TextInput
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Newsletter Subject"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="content" value="Content" />
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={handleContentChange}
                className="h-96"
                placeholder="Write your newsletter content here..."
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="mr-3">
                    <Spinner size="sm" />
                  </div>
                  Sending...
                </>
              ) : (
                "Send Newsletter"
              )}
            </Button>
          </form>
        </Card>

        {/* Preview Section */}
        <Card className="w-full">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div
            className="border rounded-md p-4 h-96 overflow-auto"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </Card>
      </div>
    </div>
  );
};

export default NewsletterEditor;