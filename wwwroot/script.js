
const employeeForm = document.getElementById("employeeForm");

let editingEmployeeId = null;


// ADD AND UPDATE EMPLOYEE
employeeForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const employee = {
        name: document.getElementById("name").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.querySelector('input[name="gender"]:checked').value,
        department: document.getElementById("department").value,
        salary: parseFloat(document.getElementById("salary").value),
        email: document.getElementById("email").value
    };

    try {

        let url = "/api/Employees";
        let method = "POST";

        if (editingEmployeeId !== null) {
            url = `/api/Employees/${editingEmployeeId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

        if (!response.ok) {
            throw new Error("Unable to save employee");
        }

        if (editingEmployeeId !== null) {
            alert("Employee updated successfully!");
        } else {
            alert("Employee added successfully!");
        }

        cancelEdit();
        loadEmployees();

    } catch (error) {
        alert(error.message);
    }

});


// DISPLAY EMPLOYEES
async function loadEmployees() {

    try {

        const response = await fetch("/api/Employees");

        const employees = await response.json();

        const employeeList = document.getElementById("employeeList");

        employeeList.innerHTML = "";

        employees.forEach(employee => {

            employeeList.innerHTML += `
                <tr>
                    <td>${employee.employeeId}</td>
                    <td>${employee.name}</td>
                    <td>${employee.age}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.department}</td>
                    <td>${employee.salary}</td>
                    <td>${employee.email}</td>
                    <td>
                       <button type="button"
    onclick="editEmployee(${employee.employeeId})"
    title="Edit Employee">
    ✏️
</button>

<button type="button"
    onclick="deleteEmployee(${employee.employeeId})"
    title="Delete Employee">
    🗑️
</button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {
        console.error("Error loading employees:", error);
    }

}


// EDIT EMPLOYEE
async function editEmployee(id) {

    try {

        const response = await fetch(`/api/Employees/${id}`);

        if (!response.ok) {
            throw new Error("Employee not found");
        }

        const employee = await response.json();

        editingEmployeeId = id;

        document.getElementById("name").value = employee.name;
        document.getElementById("age").value = employee.age;
        document.querySelector(
            `input[name="gender"][value="${employee.gender}"]`
        ).checked = true;

        document.getElementById("department").value = employee.department;
        document.getElementById("salary").value = employee.salary;
        document.getElementById("email").value = employee.email;

        document.getElementById("submitButton").textContent = "Update Employee";
        document.getElementById("cancelButton").style.display = "inline-block";

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }

}


// CANCEL EDIT
function cancelEdit() {

    editingEmployeeId = null;

    employeeForm.reset();

    document.getElementById("submitButton").textContent = "Add Employee";
    document.getElementById("cancelButton").style.display = "none";

}


// DELETE EMPLOYEE
async function deleteEmployee(id) {

    const confirmDelete = confirm("Are you sure you want to delete this employee?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/api/Employees/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete employee");
        }

        alert("Employee deleted successfully!");

        loadEmployees();

    } catch (error) {
        alert(error.message);
    }

}


// LOAD EMPLOYEES WHEN PAGE OPENS
loadEmployees();
