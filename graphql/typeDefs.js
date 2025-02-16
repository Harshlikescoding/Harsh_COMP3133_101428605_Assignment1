const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    token: String
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    designation: String
    salary: Float
    department: String
  }

  input SearchEmployeeInput {
    designation: String
    department: String
  }

  type Query {
    loginUser(loginInput: LoginInput!): User
    getAllEmployees: [Employee!]!
    getEmployeeByID(id: ID!): Employee
    searchEmployees(filter: SearchEmployeeInput): [Employee!]!
    viewAllEmployees: [Employee!]!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput!): User
    createEmployee(employeeInput: EmployeeInput!): Employee
    updateEmployee(id: ID!, updateEmployeeInput: UpdateEmployeeInput!): Employee
    deleteEmployee(id: ID!): Boolean
    loginUser(loginInput: LoginInput!): User  # <-- Add this mutation
  }
`;
