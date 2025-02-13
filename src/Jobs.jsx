import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Jobs() {
  const navigate = useNavigate();
  const [buttons, setButtons] = useState([
    { id: 1, label: "Job 1", color: "bg-blue-500", hover: "hover:bg-blue-600" },
    { id: 2, label: "Job 2", color: "bg-green-500", hover: "hover:bg-green-600" },
    { id: 3, label: "Job 3", color: "bg-purple-500", hover: "hover:bg-purple-600" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonColor, setNewButtonColor] = useState("bg-gray-500");

  const handleAddButton = () => {
    if (!newButtonLabel.trim()) return; // Prevent adding empty buttons
    setButtons([...buttons, {
      id: buttons.length + 1,
      label: newButtonLabel,
      color: newButtonColor,
      hover: "hover:brightness-110"
    }]);
    setShowModal(false);
    setNewButtonLabel(""); // Reset input
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Jobs</h1>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {buttons.map((btn) => (
          <Button
            key={btn.id}
            onClick={() => navigate("/tracker")}
            className={`w-40 h-40 text-white text-lg font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105 ${btn.color} ${btn.hover}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {/* "+" Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="w-40 h-40 mt-8 bg-gray-300 text-gray-700 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-400 flex items-center justify-center"
      >
        <span className="text-6xl">+</span>
      </Button>

      {/* Modal for Adding a New Button */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            <input
              type="text"
              placeholder="Enter button name"
              value={newButtonLabel}
              onChange={(e) => setNewButtonLabel(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
            />

            {/* Color Selection */}
            <div className="flex justify-between mb-4">
              {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-orange-500"].map((color) => (
                <div
                  key={color}
                  className={`w-10 h-10 rounded-full cursor-pointer ${color} ${newButtonColor === color ? "ring-4 ring-gray-700" : ""}`}
                  onClick={() => setNewButtonColor(color)}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                Cancel
              </Button>
              <Button onClick={handleAddButton} className="bg-blue-500 text-white hover:bg-blue-600">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
