const Joi = require("joi");
const Employee = require("../../models/employee.model");

const home = async (req, res) => {
  const { process: processType, message } = req.query;
  const process = {
    ...(processType && { type: processType }),
    ...(message && { message }),
  };
  const data = {};
  try {
    data.employees = await Employee.findAll();
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("employees/home", { data, process });
  }
};

const newEmployeePage = async (req, res) => {
  res.render("employees/form", { type: "new" });
};

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
    }),
  status: Joi.string().valid("active", "inactive").required().messages({
    "any.only": "Status must be either active or inactive",
    "string.empty": "Status is required",
  }),
}).options({ abortEarly: false });

const create = async (req, res) => {
  const { error, value } = createEmployeeSchema.validate(req.body);

  if (error) {
    const errors = error.details.reduce((acc, detail) => {
      const field = detail.path[0];
      acc[field] = detail.message;
      return acc;
    }, {});

    return res.render("employees/form", {
      data: req.body,
      errors,
      type: "new",
      process: { type: "fail", message: "Invalid/incomplete data provided" },
    });
  }

  try {
    await Employee.create(value);
    const process = { type: "success", message: "Employee added successfully" };
    res.redirect(`/employees?process=${process.type}&message=${process.message}`);
  } catch (error) {
    console.log(error);
    res.render("employees/form", {
      data: req.body,
      type: "new",
      process: { type: "fail", message: "Error occured" },
    });
  }
};

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
    }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "any.only": "Status must be either active or inactive",
  }),
}).options({ abortEarly: false });

const editPage = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      const process = { type: "fail", message: "Employee details not found" };
      return res.redirect(`/employees?process=${process.type}&message=${process.message}`);
    }

    res.render("employees/form", { data: employee, type: "edit" });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

const update = async (req, res) => {
  const { error, value } = updateEmployeeSchema.validate(req.body);
  const { id } = req.params;

  if (error) {
    const errors = error.details.reduce((acc, detail) => {
      const field = detail.path[0];
      acc[field] = detail.message;
      return acc;
    }, {});

    return res.render("employees/form", {
      data: { id, ...req.body },
      type: "edit",
      errors,
      process: { type: "fail", message: "Invalid/incomplete data provided" },
    });
  }

  try {
    const employee = await Employee.findByPk(id);
    if (!employee)
      return res.render("employees/form", {
        data: { id, ...req.body },
        type: "edit",
        process: { type: "fail", message: "Employee details not found" },
      });

    await employee.update(value);
    const process = { type: "success", message: "Employee updated successfully" };
    res.redirect(`/employees?process=${process.type}&message=${process.message}`);
  } catch (error) {
    console.log(error);
    res.render("employees/form", { data: { id, ...req.body }, type: "edit", process: { type: "fail", message: "Error occured" } });
  }
};

module.exports = { home, newEmployeePage, editPage, create, update };
