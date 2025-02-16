const Employee = require("../../models/Employee");
const { ApolloError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async viewAllEmployees() {
      return await Employee.find();
    },

    async getEmployeeByID(_, { id }) {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new ApolloError("Employee with this ID not found", "EMPLOYEE_NOT_FOUND");
      }
      return employee;
    },
  },

  Mutation: {
    async createEmployee(_, { employeeInput }) {
      const { first_name, last_name, email, gender, designation, salary, department, date_of_joining, employee_photo } = employeeInput;

      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) throw new UserInputError("Email already in use");

      const newEmployee = new Employee({
        first_name,
        last_name,
        email: email.toLowerCase(),
        gender,
        designation,
        salary,
        department,
        date_of_joining,
        employee_photo,
      });

      return await newEmployee.save();
    },

    async updateEmployee(_, { id, updateEmployeeInput }) {
      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateEmployeeInput, { new: true });
      if (!updatedEmployee) throw new ApolloError("Employee with this ID not found", "EMPLOYEE_NOT_FOUND");
      return updatedEmployee;
    },

    async deleteEmployee(_, { id }) {
      const employee = await Employee.findById(id);
      if (!employee) throw new ApolloError("Employee with this ID not found", "EMPLOYEE_NOT_FOUND");
      await employee.deleteOne();
      return true;
    },
  },
};
