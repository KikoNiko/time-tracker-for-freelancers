import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function TimeTracker() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workedHours, setWorkedHours] = useState([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState(""); // Error state for task input
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let interval;
    if (isCheckedIn) {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB").replace(/\//g, "."); // Converts to DD.MM.YYYY
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); // Converts to HH:MM
  };

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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(workedHours);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Hours");
    XLSX.writeFile(wb, "work_hours.xlsx");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-4">Time Tracker</h1>
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

        {/* Button Group - Horizontally aligned */}
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleCheckIn} disabled={isCheckedIn} variant="success">
            Check In
          </Button>
          <Button onClick={handleCheckOut} disabled={!isCheckedIn} variant="danger">
            Check Out
          </Button>
          <Button onClick={exportToExcel} disabled={workedHours.length === 0} variant="primary">
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
