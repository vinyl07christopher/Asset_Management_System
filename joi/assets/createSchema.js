const Joi = require("joi");

const createAssetSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 100 characters",
    "any.required": "Name is required",
  }),

  serialNumber: Joi.string().alphanum().required().messages({
    "string.base": "Serial Number should be a type of text",
    "string.empty": "Serial Number cannot be empty",
    "any.required": "Serial Number is required",
  }),

  uniqueId: Joi.string().alphanum().required().messages({
    "string.base": "Unique ID should be a type of text",
    "string.empty": "Unique ID cannot be empty",
    "any.required": "Unique ID is required",
  }),

  make: Joi.string().max(50).required().messages({
    "string.base": "Make should be a type of text",
    "string.empty": "Make cannot be empty",
    "any.required": "Make is required",
  }),

  model: Joi.string().max(50).required().messages({
    "string.base": "Model should be a type of text",
    "string.empty": "Model cannot be empty",
    "any.required": "Model is required",
  }),

  purchaseDate: Joi.date().required().messages({
    "date.base": "Purchase Date should be a valid date",
    "any.required": "Purchase Date is required",
  }),

  value: Joi.number().positive().required().messages({
    "number.base": "Value must be a number",
    "number.positive": "Value must be a positive number",
    "any.required": "Value is required",
  }),

  branch: Joi.string().max(100).required().messages({
    "string.base": "Branch should be a type of text",
    "string.empty": "Branch cannot be empty",
    "any.required": "Branch is required",
  }),

  assetCategoryId: Joi.number().integer().required().messages({
    "number.base": "Asset Category must be a number",
    "any.required": "Asset Category is required",
  }),
});

module.exports = createAssetSchema;
