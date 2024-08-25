"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import GanttChart from "./components/GanttChart"; // Import the GanttChart component

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>(
    "I am planning a software development project to build a new web application. The project should start with the initial planning phase next Monday, followed by the design phase starting two weeks later. One week after the design phase begins, we will start the development phase. The development phase should take three weeks. After development, we will enter the testing phase, which should last two weeks. Finally, we will have a deployment phase that will start one week after testing begins and should be completed in three days."
  );
  const [response, setResponse] = useState<Object[] | null>(null);
  const [editableJson, setEditableJson] = useState<string>(""); // State for editable JSON
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true); // Set loading to true when request starts
    try {
      const result = await axios.post("/api/chatgpt", { prompt });
      setResponse(result.data.content); // Adjust based on response structure
      setEditableJson(JSON.stringify(result.data.content, null, 2)); // Convert response to a formatted JSON string
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse([]);
      setEditableJson(""); // Clear editable JSON in case of error
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  const handleConfirmChanges = () => {
    try {
      const parsedData = JSON.parse(editableJson); // Parse the edited JSON
      setResponse(parsedData); // Update the response state with parsed data
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("There is an error in your JSON format. Please correct it and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Adjusted height for parent container */}
      <main className="flex flex-1 p-4 gap-4 overflow-auto">
        <div className="flex flex-col md:flex-row flex-1 gap-4">
          {/* Column 1: Input Section */}
          <div className="flex-1 bg-gray-100 p-4 rounded shadow-md flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Prompt</h1>
            <div className="flex-1 flex flex-col">
              <textarea className="w-full bg-white mb-4 p-2 border border-gray-300 rounded resize-none" placeholder="Enter text here..." value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={10} />
              <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700" onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating..." : "Generate ✨"}
              </button>
            </div>
          </div>

          {/* Column 2: JSON Editor Section */}
          <div className="flex-1 bg-gray-100 p-4 rounded shadow-md flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Data Editor</h1>
            <div className="flex-1 flex flex-col">
              <textarea
                className="w-full bg-white mb-4 p-2 border border-gray-300 rounded resize-none"
                value={editableJson}
                onChange={(e) => setEditableJson(e.target.value)}
                rows={10}
                style={{ maxHeight: "60vh" }} // Limit height of the textarea
              />
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleConfirmChanges}>
                {response ? "Validate ✓" : "Validate"}
              </button>
            </div>
          </div>

          {/* Column 3: Gantt Chart Section */}
          <div className="flex-1 bg-gray-100 p-4 rounded shadow-md flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Gantt Chart</h1>
            <div className="flex-1 overflow-auto">{response && !loading && <GanttChart data={response} />}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
