import { useEffect, useState } from "react";
import {
  convertToUnixTimestamp,
  convertDurationToMinutes,
  formatDuration,
  formatDate,
} from "./utils/TimeEntries";
import * as I from "./types/index";

import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { UserInfoDialog } from "./components/features/UserInfoDialog";
import { Loader2 } from "lucide-react";

function App() {
  const [timeEntries, setTimeEntries] = useState<I.FormattedTimeEntry[]>([]);
  const [dialog, setDialog] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n");

        // Skip header row and parse data
        const parsedData: I.FormattedTimeEntry[] = rows
          .slice(1)
          .filter((row) => row.trim()) // Filter out empty rows
          .map((row) => {
            // Remove any carriage returns and extra whitespace
            const cleanRow = row.replace(/\r/g, "").trim();
            console.log("Processing row:", cleanRow); // Debug row

            const [start_time, duration, task_id] = cleanRow
              .split(",")
              .map((item) => item.trim());

            console.log("Parsed values:", { start_time, duration, task_id }); // Debug parsed values

            return {
              start: convertToUnixTimestamp(start_time),
              duration: convertDurationToMinutes(duration),
              assignee: 95455324, // Hardcoded assignee
              tid: task_id,
              response: "",
            };
          });

        setTimeEntries(parsedData);
        console.log("Formatted Time Entries:", parsedData);
      };
      reader.readAsText(file);
    }
  };

  const postTimeEntry = async (payload: I.FormattedTimeEntry) => {
    try {
      const API_KEY = localStorage.getItem("api_key");
      const USER_ID = localStorage.getItem("user_id");

      if (!API_KEY || !USER_ID) {
        alert("API_KEY or USER_ID not found in local storage");
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", API_KEY?.toString() || "");

      const raw = JSON.stringify({
        start: payload.start,
        duration: payload.duration * 60000, // Convert minutes to milliseconds
        assignee: payload.assignee,
        tid: payload.tid,
      });

      const response = await fetch(
        `https://api.clickup.com/api/v2/team/${USER_ID}/time_entries`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // Get error message from API response
        const errorMessage =
          result.err ||
          result.error ||
          result.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      console.log(`Successfully posted entry for task ${payload.tid}:`, result);
      return result;
    } catch (error) {
      console.error(`Failed to post entry for task ${payload.tid}:`, error);
      throw error;
    }
  };

  const handlePostAllEntries = async () => {
    try {
      setIsLoading(true);
      console.log(`Starting to post ${timeEntries.length} time entries...`);

      const updatedEntries = [...timeEntries];

      for (let i = 0; i < timeEntries.length; i++) {
        const entry = timeEntries[i];
        console.log(`Posting entry for task ${entry.tid}...`);

        try {
          const data = await postTimeEntry(entry);
          console.log(data);
          updatedEntries[i] = {
            ...entry,
            response: "Uploaded",
            status: "success",
          };
        } catch (error) {
          updatedEntries[i] = {
            ...entry,
            response: error instanceof Error ? error.message : "Unknown error",
            status: "error",
          };
        }

        setTimeEntries(updatedEntries);
        // Optional: Add delay between requests if needed
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setIsLoading(false);
      console.log("All time entries processed!");
    } catch (error) {
      console.error("Failed to post all entries:", error);
    }
  };

  const submitForm = () => {
    setDialog(false);
    localStorage.setItem("api_key", apiKey);
    localStorage.setItem("user_id", userId);
  };

  useEffect(() => {
    const apiKey = localStorage.getItem("api_key");
    if (!apiKey) {
      setDialog(true);
    }
  }, []);

  return (
    <main className="container mx-auto p-4">
      <UserInfoDialog
        open={dialog}
        userId={userId}
        apiKey={apiKey}
        onUserIdChange={setUserId}
        onApiKeyChange={setApiKey}
        onSubmit={submitForm}
      />

      <h1 className="text-center text-4xl mb-8 py-10">ClickUp Time Entries</h1>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <label htmlFor="csvInput" className="block text-sm font-medium mb-2">
            Upload Entry Data (
            <a href="./template.csv" className="underline text-blue-700">
              Download Template
            </a>
            )
          </label>
          <Input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>

        {timeEntries.length > 0 && (
          <div>
            <Button
              className="cursor-pointer"
              disabled={isLoading}
              onClick={() => handlePostAllEntries()}
            >
              {isLoading ? (
                <div className="w-20 text-center flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Post Entry"
              )}
            </Button>
          </div>
        )}

        {/* Display uploaded data */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Time Entries</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">Duration</th>
                  <th className="px-4 py-2">Assignee</th>
                  <th className="px-4 py-2">Task ID</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.length > 0 ? (
                  timeEntries.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{formatDate(entry.start)}</td>
                      <td className="px-4 py-2">
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="px-4 py-2">{entry.assignee}</td>
                      <td className="px-4 py-2">{entry.tid}</td>
                      <td
                        className={`px-4 py-2 ${
                          entry.status === "success"
                            ? "text-green-600"
                            : entry.status === "error"
                              ? "text-red-600"
                              : ""
                        }`}
                      >
                        {entry.response}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                      No Time Entries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
