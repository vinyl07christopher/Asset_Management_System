const Joi = require("joi");

const updateAssetSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 100 characters",
  }),

  serialNumber: Joi.string().alphanum().optional().messages({
    "string.base": "Serial Number should be a type of text",
    "string.empty": "Serial Number cannot be empty",
  }),

  uniqueId: Joi.string().alphanum().optional().messages({
    "string.base": "Unique ID should be a type of text",
    "string.empty": "Unique ID cannot be empty",
  }),

  make: Joi.string().max(50).optional().messages({
    "string.base": "Make should be a type of text",
    "string.empty": "Make cannot be empty",
  }),

  model: Joi.string().max(50).optional().messages({
    "string.base": "Model should be a type of text",
    "string.empty": "Model cannot be empty",
  }),

  purchaseDate: Joi.date().optional().messages({
    "date.base": "Purchase Date should be a valid date",
  }),

  value: Joi.number().positive().optional().messages({
    "number.base": "Value must be a number",
    "number.positive": "Value must be a positive number",
  }),

  branch: Joi.string().max(100).optional().messages({
    "string.base": "Branch should be a type of text",
    "string.empty": "Branch cannot be empty",
  }),

  assetCategoryId: Joi.number().integer().optional().messages({
    "number.base": "Asset Category must be a number",
  }),
});

module.exports = updateAssetSchema;
