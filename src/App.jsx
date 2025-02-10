import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function TimeTracker() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [workedHours, setWorkedHours] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let interval;
    if (isCheckedIn) {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    if (checkInTime) {
      const checkOutTime = new Date();
      const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      const record = {
        date: checkInTime.toISOString().slice(0, 7), // Year-Month
        hoursWorked: hoursWorked.toFixed(2),
      };
      setWorkedHours([...workedHours, record]);
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(workedHours);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Hours");
    XLSX.writeFile(wb, "work_hours.xlsx");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 min-h-screen w-full text-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Time Tracker</h1>
        <p className="text-lg font-semibold text-gray-700">Date: {new Date().toISOString().slice(0, 10)}</p>
        {isCheckedIn && <p className="text-xl font-mono text-green-600 mt-2">{currentTime.toLocaleTimeString()}</p>}
        {!isCheckedIn && workedHours.length > 0 && (
          <p className="text-lg font-semibold text-gray-700 mt-2">Hours Worked: {workedHours[workedHours.length - 1].hoursWorked}</p>
        )}
        <div className="flex flex-col gap-4 mt-6">
          <Button onClick={handleCheckIn} disabled={isCheckedIn} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
            Check In
          </Button>
          <Button onClick={handleCheckOut} disabled={!isCheckedIn} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
            Check Out
          </Button>
          <Button onClick={exportToExcel} disabled={workedHours.length === 0} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
