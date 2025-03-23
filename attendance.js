const markAttendanceBtn = document.getElementById("mark-attendance");
const weeklyAttendanceText = document.getElementById("weekly-attendance");
const monthlyAttendanceText = document.getElementById("monthly-attendance");
const attendanceList = document.getElementById("attendance-list");

let attendanceData = JSON.parse(localStorage.getItem("attendance")) || { days: [] };

// Function to update the UI
function updateAttendanceUI() {
    let currentDate = new Date();
    let today = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Clear list and re-add all attendance records
    attendanceList.innerHTML = "";
    attendanceData.days.forEach(date => {
        let li = document.createElement("li");
        li.textContent = date === today ? `${date} ✅` : date;
        attendanceList.appendChild(li);
    });

    // Update weekly and monthly stats
    let weeklyCount = getAttendanceCount(7);
    let monthlyCount = getAttendanceCount(30);

    weeklyAttendanceText.textContent = `Attendance: ${weeklyCount}/7`;
    monthlyAttendanceText.textContent = `Attendance: ${monthlyCount}/30`;

    // Save data to Local Storage
    localStorage.setItem("attendance", JSON.stringify(attendanceData));
}

// Function to get attendance count for the last X days
function getAttendanceCount(days) {
    let currentDate = new Date();
    let pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);

    return attendanceData.days.filter(date => new Date(date) >= pastDate).length;
}

// Function to mark attendance
function markAttendance() {
    let currentDate = new Date();
    let today = currentDate.toISOString().split("T")[0];

    if (!attendanceData.days.includes(today)) {
        attendanceData.days.push(today);
        alert("✅ Attendance marked for today!");

        // Add reward points
        addRewardPoints(10); // Earn 10 points for daily attendance
    } else {
        alert("⚠️ You have already marked attendance today.");
    }

    updateAttendanceUI();
}


// Event Listener
markAttendanceBtn.addEventListener("click", markAttendance);

// Initialize the UI
updateAttendanceUI();
