using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementAPI.Data;
using EmployeeManagementAPI.Models;

namespace EmployeeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public EmployeesController(EmployeeDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        // GET: api/employees/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound("Employee not found");

            return Ok(employee);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> AddEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        // PUT: api/employees/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            var existingEmployee = await _context.Employees.FindAsync(id);

            if (existingEmployee == null)
                return NotFound("Employee not found");

            existingEmployee.Name = employee.Name;
            existingEmployee.Age = employee.Age;
            existingEmployee.Gender = employee.Gender;
            existingEmployee.Department = employee.Department;
            existingEmployee.Salary = employee.Salary;
            existingEmployee.Email = employee.Email;

            await _context.SaveChangesAsync();

            return Ok(existingEmployee);
        }

        // DELETE: api/employees/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound("Employee not found");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok("Employee deleted successfully");
        }
    }
}