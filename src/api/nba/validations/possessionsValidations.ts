import Joi from "joi";

export const possessionSchemas = {
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Possession Id is required",
                "string.empty": "Possession Id cannot be empty",
            })
        })
    }
};