const Employee = require("../models/employee.model");

const getAll = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json({ message: "Employee data retrieved successfully", data: employees });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee data retrieved successfully", data: employee });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
};

const create = async (req, res) => {
  const { name, email, phone, status } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ message: "Invalid/incomplete data provided" });
  const data = { name, email, phone, ...(status && { status }) };
  try {
    const newEmployee = await Employee.create(data);
    res.json({ message: "New employee added successfully", data: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error while storing data" });
  }
};

const update = async (req, res) => {
  const { name, email, phone, status } = req.body;
  const { id } = req.params;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    name && (employee.name = name);
    email && (employee.email = email);
    phone && (employee.phone = phone);
    status && (employee.status = status);

    await employee.save();

    res.json({ message: "Employee data updated successfully", data: employee });
  } catch (error) {
    res.status(500).json({ message: "Error while updating data" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const numOfAffectedRows = await Employee.destroy({ where: { id } });

    if (numOfAffectedRows < 1) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting data" });
  }
};

module.exports = { getAll, get, create, update, remove };
