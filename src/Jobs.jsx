import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Jobs() {
  const apiUrl = 'https://time-tracker-backend-0tr7.onrender.com';
  const navigate = useNavigate();
  const [buttons, setButtons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonColor, setNewButtonColor] = useState("#6b7280");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [buttonToDelete, setButtonToDelete] = useState(null);
  const [jobLimitReached, setJobLimitReached] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setButtons(data);
        setJobLimitReached(data.length >= 10);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  
  const handleAddButton = async () => {
    if (!newButtonLabel.trim()) return;
    
    const jobExists = buttons.some(
      (job) => job.name.toLowerCase() === newButtonLabel.toLowerCase()
    );
  
    if (jobExists) {
      alert("A job with this name already exists!");
      return;
    }
  
    const newJob = { name: newButtonLabel, color: newButtonColor };
  
    fetch(`${apiUrl}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setButtons([...buttons, data]);
          setJobLimitReached(buttons.length + 1 >= 10);
          setShowModal(false);
          setNewButtonLabel("");
        }
      })
      .catch((err) => console.error("Error adding job:", err));
  };
  
  
  const confirmDeleteButton = (id) => {
    setButtonToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteButton = () => {
    if (buttonToDelete !== null) {
      fetch(`${apiUrl}/jobs/${buttonToDelete}`, {
        method: "DELETE",
      })
        .then(() => {
          setButtons(buttons.filter((btn) => btn.id !== buttonToDelete));
          setShowDeleteModal(false);
          setButtonToDelete(null);
        })
        .catch((err) => console.error("Error deleting job:", err));
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Jobs</h1>

      {/* Buttons Grid */}
      {buttons.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {buttons.map((btn) => (
            <motion.div
              key={btn.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-40 h-40"
            >
              <button
                onClick={() => navigate(`/tracker?job=${encodeURIComponent(btn.name)}`)}
                className="w-full h-full text-white text-lg font-semibold rounded-2xl shadow-lg transform transition-all hover:scale-105"
                style={{ backgroundColor: btn.color }}
              >
                {btn.name}
              </button>


              {/* Delete Button (Trash Icon) */}
              <button
                onClick={() => confirmDeleteButton(btn.id)}
                className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow-md hover:bg-gray-200 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* "+" Button */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileTap={{ scale: 0.9 }}
        className="w-40 h-40 bg-gray-300 text-gray-700 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-400 flex items-center justify-center"
      >
        <span className="text-6xl">+</span>
      </motion.button>
      {jobLimitReached && (
        <p className="text-red-500 text-lg font-semibold mt-2">
          You have reached the job limit (10 jobs max).
        </p>
      )}

      {/* Add Button Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
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
                {[
                  { name: "Blue", color: "#3b82f6" },
                  { name: "Green", color: "#22c55e" },
                  { name: "Purple", color: "#a855f7" },
                  { name: "Red", color: "#ef4444" },
                  { name: "Yellow", color: "#fede00" },
                  { name: "Orange", color: "#ffa500" },
                ].map(({ name, color }) => (
                  <div
                    key={name}
                    className="w-10 h-10 rounded-full cursor-pointer border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: newButtonColor === color ? "black" : "transparent",
                    }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-xl font-bold mb-4 text-red-600">Delete Job?</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this job? This action cannot be undone.</p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                  Cancel
                </Button>
                <Button onClick={handleDeleteButton} className="bg-red-500 text-white hover:bg-red-600">
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
