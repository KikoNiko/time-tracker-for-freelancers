import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function TimeTracker() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workedHours, setWorkedHours] = useState([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState(""); // Error state for task input
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobName = queryParams.get("job"); // Extract job name
  const [isExported, setIsExported] = useState(false); // Track export status

  // Redirect user if no job name is found
  useEffect(() => {
    if (!jobName) {
      navigate("/"); // Redirect to Jobs page
    }
  }, [jobName, navigate]);

  useEffect(() => {
    let interval;
    if (isCheckedIn) {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatDate = (date) => date.toLocaleDateString("en-GB").replace(/\//g, "."); // DD.MM.YYYY
  const formatTime = (date) => date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); // HH:MM

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setError(""); // Clear any previous error when checking in
  };

  const handleCheckOut = () => {
    if (!task.trim()) {
      setError("Please enter a task before checking out.");
      return;
    }

    if (checkInTime) {
      const checkOutTime = new Date();
      checkOutTime.setSeconds(0, 0);
      checkInTime.setSeconds(0, 0);
      const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

      const record = {
        Date: formatDate(checkInTime),
        "Check In": formatTime(checkInTime),
        "Check Out": formatTime(checkOutTime),
        "Hours Worked": hoursWorked.toFixed(2),
        Task: task.trim(),
      };

      setWorkedHours([...workedHours, record]);
      setIsCheckedIn(false);
      setCheckInTime(null);
      setTask("");
      setError(""); // Clear error after successful checkout
    }
  };

  const handleExport = async () => {
    if (workedHours.length === 0) {
      alert("No data to export!");
      return;
    }

    if (isExported) {
      alert("Data has already been exported!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-job-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobName, data: workedHours }), // Send job name
      });

      if (response.ok) {
        alert(`Data exported successfully to Google Sheet: ${jobName}`);
        setIsExported(true);
      } else {
        alert("Failed to export data.");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-4">Time Tracker for: {jobName}</h1>
        <p className="text-gray-600 text-sm">{formatDate(new Date())}</p>

        {isCheckedIn && (
          <p className="text-xl font-mono text-green-600 mt-4">
            Current Time: {currentTime.toLocaleTimeString()}
          </p>
        )}

        {!isCheckedIn && workedHours.length > 0 && (
          <div className="text-lg font-semibold text-gray-700 mt-4">
            <p>Last Check-in: {workedHours[workedHours.length - 1]["Check In"]}</p>
            <p>Last Check-out: {workedHours[workedHours.length - 1]["Check Out"]}</p>
            <p>Hours Worked: {workedHours[workedHours.length - 1]["Hours Worked"]}</p>
            <p>Task: {workedHours[workedHours.length - 1]["Task"]}</p>
          </div>
        )}

        {/* Button Group */}
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleCheckIn} disabled={isCheckedIn} variant="success">
            Check In
          </Button>
          <Button onClick={handleCheckOut} disabled={!isCheckedIn} variant="danger">
            Check Out
          </Button>
          <Button onClick={handleExport} disabled={workedHours.length === 0 || isExported} variant="primary">
            Export
          </Button>
        </div>

        {/* Task Input */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              if (e.target.value.trim()) setError(""); // Clear error if user types a valid task
            }}
            placeholder="Enter task description..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
