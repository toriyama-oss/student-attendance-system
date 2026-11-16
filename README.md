# Student Attendance System

A beginner-friendly web application built with HTML, CSS and vanilla JavaScript.

## Features
- Add students using their names and unique admission numbers.
- Search students by name or admission number.
- Mark students present or absent for a selected date.
- Mark all students present with one click.
- View daily totals for present and absent students.
- Remove a student from the register.
- Export the selected day's register as a CSV file.
- Save data in browser `localStorage`.

## Run the project
1. Download or extract the project folder.
2. Open `index.html` in a web browser, or open the folder in Visual Studio Code.
3. If using VS Code, install the **Live Server** extension (optional).
4. Right-click `index.html` and choose **Open with Live Server**.

No database or server setup is required for this demo. Data is stored in the browser on the device where it is used. Clearing browser storage will erase the saved records.

## Project structure
```text
student-attendance-system/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Push to GitHub
Create an empty repository on GitHub, then open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Build student attendance system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with the URL of your own GitHub repository.

## Possible future improvements
- Login for administrators and lecturers.
- A database such as MySQL or Firebase.
- Student attendance reports by week or semester.
- Role-based access and server-side validation.
