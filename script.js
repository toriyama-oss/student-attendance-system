const STORAGE_KEY = "studentAttendanceSystem_v1";

const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const admissionNo = document.getElementById("admissionNo");
const attendanceDate = document.getElementById("attendanceDate");
const attendanceBody = document.getElementById("attendanceBody");
const searchInput = document.getElementById("searchInput");
const formMessage = document.getElementById("formMessage");
const emptyMessage = document.getElementById("emptyMessage");

let data = loadData();

function localDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

attendanceDate.value = localDateString();

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && Array.isArray(saved.students) ? saved : { students: [], attendance: {} };
  } catch {
    return { students: [], attendance: {} };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDayRecords() {
  const day = attendanceDate.value;
  if (!data.attendance[day]) data.attendance[day] = {};
  return data.attendance[day];
}

function render() {
  const dayRecords = getDayRecords();
  const query = searchInput.value.trim().toLowerCase();
  const visibleStudents = data.students.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.admission.toLowerCase().includes(query)
  );

  attendanceBody.innerHTML = "";
  visibleStudents.forEach((student, index) => {
    const status = dayRecords[student.id] || "Unmarked";
    const statusClass = status.toLowerCase();
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);
    const nameCell = document.createElement("td");
    nameCell.textContent = student.name;
    const admissionCell = document.createElement("td");
    admissionCell.textContent = student.admission;
    const statusCell = document.createElement("td");
    const statusBadge = document.createElement("span");
    statusBadge.className = `status ${statusClass}`;
    statusBadge.textContent = status;
    statusCell.appendChild(statusBadge);

    const actionCell = document.createElement("td");
    const toggleButton = document.createElement("button");
    toggleButton.className = "action-btn";
    toggleButton.textContent = status === "Present" ? "Mark absent" : "Mark present";
    toggleButton.addEventListener("click", () => {
      getDayRecords()[student.id] = status === "Present" ? "Absent" : "Present";
      saveData();
      render();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "action-btn delete-btn";
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", () => removeStudent(student.id));

    actionCell.append(toggleButton, deleteButton);
    row.append(numberCell, nameCell, admissionCell, statusCell, actionCell);
    attendanceBody.appendChild(row);
  });

  emptyMessage.hidden = data.students.length > 0;
  document.getElementById("totalStudents").textContent = data.students.length;
  const allStatuses = Object.values(dayRecords);
  document.getElementById("presentToday").textContent = allStatuses.filter(s => s === "Present").length;
  document.getElementById("absentToday").textContent = allStatuses.filter(s => s === "Absent").length;
}

studentForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = studentName.value.trim();
  const admission = admissionNo.value.trim();

  if (!name || !admission) return;
  if (data.students.some(s => s.admission.toLowerCase() === admission.toLowerCase())) {
    formMessage.textContent = "That admission number already exists.";
    formMessage.style.color = "#b91c1c";
    return;
  }

  data.students.push({
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    name,
    admission
  });
  saveData();
  studentForm.reset();
  formMessage.textContent = "Student added successfully.";
  formMessage.style.color = "#15803d";
  render();
});

function removeStudent(id) {
  const student = data.students.find(s => s.id === id);
  if (!student || !confirm(`Remove ${student.name} from the register?`)) return;
  data.students = data.students.filter(s => s.id !== id);
  Object.values(data.attendance).forEach(day => delete day[id]);
  saveData();
  render();
}

attendanceDate.addEventListener("change", render);
searchInput.addEventListener("input", render);

document.getElementById("markAllPresent").addEventListener("click", () => {
  const day = getDayRecords();
  data.students.forEach(student => { day[student.id] = "Present"; });
  saveData();
  render();
});

document.getElementById("exportCsv").addEventListener("click", () => {
  const day = attendanceDate.value;
  const records = data.attendance[day] || {};
  const rows = [["Student name", "Admission number", "Date", "Status"]];
  data.students.forEach(student => {
    rows.push([student.name, student.admission, day, records[student.id] || "Unmarked"]);
  });
  const csv = rows.map(row => row.map(value =>
    `"${String(value).replaceAll('"', '""')}"`
  ).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-${day}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

render();
