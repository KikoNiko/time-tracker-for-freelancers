
# 📅 Time Tracker

A simple and intuitive web-based time tracking application to track working hours, breaks, and tasks. This application helps users track their daily work routine, export tracked data to a Google Sheet, and manage their work time efficiently.

---

## 🚀 Features
- **Check In / Check Out:** Track the start and end of your work sessions.
- **Break Tracking:** Pause your session and track breaks accurately.
- **Break List:** Keep a structured list of all breaks taken.
- **Time Calculation:** Automatically calculate worked hours by subtracting break time.
- **Export Data:** Export tracked data to a Google Sheet.
- **Persistent Data:** The tracked data is persistent until exported.
- **Clean and Intuitive UI:** A user-friendly interface to manage tasks and work time.

---

## 🛠️ Technologies Used
- **Frontend:** React, TailwindCSS, HTML, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Google Sheets (as a data storage solution)
- **Deployment:** Render (for backend API)

---

## 📝 Prerequisites
- Node.js and npm installed
- A Google Sheets API key
- A configured Google Sheets project with the necessary permissions

---

## 📝 How It Works

### Time Tracking
1. **Check In:**
   - Click the **"Check In"** button to start tracking time.
   - The **current time** and **check-in time** are displayed.
   - The **pause** and **check out** buttons are enabled.

2. **Pause/Resume:**
   - Click the **"Pause"** button to take a break.
   - The break timer starts.
   - Click **"Resume"** to continue tracking time. 
   - The break duration is automatically recorded in a structured list.
   - Break durations are **rounded to the nearest minute**.

3. **Check Out:**
   - Click the **"Check Out"** button to end the tracking session.
   - The total **worked hours** (excluding breaks) are calculated.
   - The break list and task description are cleared for the next session.

---

### Data Calculation
- **Total Work Time:** Calculated as the difference between check-in and check-out time, minus the total break duration.
- **Breaks:** Accumulated as an array of break durations in minutes.
- **Time Format:** Displayed in the format **`hh:mm`**, rounded to the nearest minute.
- **Real-Time Updates:** Time and break durations are updated in real-time using React state management.

---

### Data Export
1. **Google Sheets Integration:**
   - Clicking the **"Export"** button sends the data to the backend.
   - The backend processes and exports the data to a Google Sheet via the **Google Sheets API**.
   
2. **Exported Data Format:**
   - The data is stored as follows:
     ```
     Date        Check In    Check Out    Hours Worked   Time    Breaks    Task
     12.03.2025  09:00       17:30        8.50           8:30    30 min    Development
     ```
   - The **"Time"** column shows the worked hours in the `hh:mm` format.
