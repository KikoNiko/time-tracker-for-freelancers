import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";

export default function TimeTracker() {
  const apiUrl = "https://time-tracker-backend-0tr7.onrender.com";
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workedHours, setWorkedHours] = useState([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const [totalBreakMinutes, setTotalBreakMinutes] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobName = queryParams.get("job");
  const [isExported, setIsExported] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);

  useEffect(() => {
    if (!jobName) navigate("/");
  }, [jobName, navigate]);

  useEffect(() => {
    let interval;
    if (isCheckedIn) {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  useEffect(() => {
    let breakInterval;
    if (isPaused) {
      breakInterval = setInterval(() => {
        setBreakTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(breakInterval);
  }, [isPaused]);

  const formatDate = (date) => date.toLocaleDateString("en-GB").replace(/\//g, ".");
  const formatTime = (date) => date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const formatBreakTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setBreaks([]);
    setTotalBreakMinutes(0);
    setError("");
  };

  const handlePauseResume = () => {
    if (!isPaused) {
      setPauseStartTime(new Date());
      setBreakTimer(0);
    } else {
      const roundedMinutes = Math.round(breakTimer / 60);
      setBreaks([...breaks, roundedMinutes]);
      setTotalBreakMinutes(totalBreakMinutes + roundedMinutes);
      setBreakTimer(0);
    }
    setIsPaused(!isPaused);
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
      const netWorkedHours = hoursWorked - totalBreakMinutes / 60;
  

      const totalMinutes = Math.round(netWorkedHours * 60);
      const formattedTime = `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
  
      const record = {
        Date: formatDate(checkInTime),
        "Check In": formatTime(checkInTime),
        "Check Out": formatTime(checkOutTime),
        Time: formattedTime,
        "Hours Worked": netWorkedHours.toFixed(2),
        Breaks: `${totalBreakMinutes} min`,
        Task: task.trim(),
      };
  
      setWorkedHours([...workedHours, record]);
      setIsCheckedIn(false);
      setCheckInTime(null);
      setTask("");
      setBreaks([]);
      setTotalBreakMinutes(0);
      setError("");
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
      const response = await fetch(`${apiUrl}/add-job-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobName, data: workedHours }),
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

        {isPaused && (
          <p className="text-lg font-mono text-yellow-600 mt-2">
            Break Time: {formatBreakTimer(breakTimer)}
          </p>
        )}

        {breaks.length > 0 && (
          <div className="mt-4 text-gray-700 text-sm text-left bg-gray-100 p-3 rounded-lg shadow">
            <p className="font-bold text-center mb-2 text-gray-800">Breaks</p>
            <ul className="list-none space-y-1">
              {breaks.map((breakMin, index) => (
                <li key={index} className="text-gray-600">
                  <span className="font-semibold">Break {index + 1}:</span> {breakMin} min
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isCheckedIn && workedHours.length > 0 && (
          <div className="text-lg font-semibold text-gray-700 mt-4">
            <p>Last Check-in: {workedHours[workedHours.length - 1]["Check In"]}</p>
            <p>Last Check-out: {workedHours[workedHours.length - 1]["Check Out"]}</p>
            <p>Hours Worked: {workedHours[workedHours.length - 1]["Hours Worked"]}</p>
            <p>Breaks: {workedHours[workedHours.length - 1]["Breaks"]}</p>
            <p>Task: {workedHours[workedHours.length - 1]["Task"]}</p>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleCheckIn} disabled={isCheckedIn} variant="success">
            Check In
          </Button>
          <Button onClick={handlePauseResume} disabled={!isCheckedIn} variant="warning">
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button onClick={handleCheckOut} disabled={!isCheckedIn} variant="danger">
            Check Out
          </Button>
          <Button onClick={handleExport} disabled={workedHours.length === 0 || isExported} variant="primary">
            Export
          </Button>
        </div>
        
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              if (e.target.value.trim()) setError("");
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


