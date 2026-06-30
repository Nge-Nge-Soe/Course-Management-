let students = JSON.parse(localStorage.getItem('students')) || [];

// DOM Elements
const menuLinks = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');
const studentForm = document.getElementById('student-form');
const studentList = document.getElementById('student-list');
const searchInput = document.getElementById('search-input');
const noDataView = document.getElementById('no-data');
const totalStudentsElements = document.querySelectorAll('.total-students-count');

// PAGE NAVIGATION (SPA SWITCH LOGIC)
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        menuLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        
        const targetSectionId = link.getAttribute('data-target');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSectionId) {
                section.classList.add('active');
            }
        });
        updateHeaderTitle(link.innerText.trim());
    });
});

function updateHeaderTitle(menuName) {
    pageTitle.innerText = menuName;
    if (menuName === "Dashboard") {
        document.getElementById('page-desc').innerText = "Overview of your academic center.";
    } else if (menuName === "Courses") {
        document.getElementById('page-desc').innerText = "Explore and manage available course programs.";
    } else if (menuName === "Students") {
        document.getElementById('page-desc').innerText = "Add new registrations and view student database.";
    } else if (menuName === "Settings") {
        document.getElementById('page-desc').innerText = "Configure control panel and system reset.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStudents(students);
});

if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const name = document.getElementById('studentName').value.trim();
        const email = document.getElementById('studentEmail').value.trim();
        const course = document.getElementById('courseSelect').value;
        const studentId = 'STU-' + Date.now().toString().slice(-4);

        const newStudent = { id: studentId, name: name, email: email, course: course };
        students.push(newStudent);
        saveAndRefresh();
        studentForm.reset();
    });
}

function renderStudents(studentsArray) {
    if (!studentList) return;
    studentList.innerHTML = ''; 
    if (studentsArray.length === 0) {
        if (noDataView) noDataView.classList.remove('hidden');
    } else {
        if (noDataView) noDataView.classList.add('hidden');
    }

    studentsArray.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${student.id}</strong></td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td><span class="course-badge">${student.course}</span></td>
            <td>
                <button class="btn-delete" onclick="deleteStudent('${student.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        studentList.appendChild(row);
    });

    totalStudentsElements.forEach(el => el.innerText = students.length);
}

window.deleteStudent = function(id) {
    if (confirm("Are you sure you want to remove this student?")) {
        students = students.filter(student => student.id !== id);
        saveAndRefresh();
    }
}

// Search Filter
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.course.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm)
        );
        renderStudents(filteredStudents);
    });
}

function saveAndRefresh() {
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents(students);
}

window.clearAllData = function() {
    if (confirm("🚨 WARNING: This will delete ALL students from the database permanently! Proceed?")) {
        students = [];
        saveAndRefresh();
        alert("All student data cleared successfully.");
    }
}