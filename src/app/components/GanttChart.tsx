import React from "react";
import { Chart } from "react-google-charts";

// Columns for the Gantt Chart
const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

// Function to parse and convert data
function parseChatGPTData(data: any): any[] {
  // Convert strings to Date objects and structure the data for the Gantt chart
  return data.map((task: any) => [
    `Task ${task.id}`, // Task ID
    task.name, // Task Name
    new Date(task.start), // Start Date (converted from string to Date)
    new Date(task.end), // End Date (converted from string to Date)
    null, // Duration is null since start and end dates are provided
    0, // Percent Complete (defaulting to 0 for now)
    task.dependency ? `Task ${task.dependency}` : null, // Dependencies
  ]);
}

export function GanttChart({ data }: { data: any[] | string }) {
  // Check if data is a string and parse it, otherwise use it as-is
  let parsedData: any[] = [];

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse JSON data:", error);
    }
  } else {
    parsedData = data;
  }

  // Format the data for the Google Gantt Chart
  const formattedData = parsedData.length ? [columns, ...parseChatGPTData(parsedData)] : [columns];
  console.log("formattedData", formattedData);

  return <Chart chartType="Gantt" width="100%" height="600px" data={formattedData} />;
}

// For testing purposes, this component can be used in other parts of your app
export default GanttChart;
