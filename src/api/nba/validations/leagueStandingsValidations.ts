import Joi from "joi";

export const standingsSchemas = {
    create: {
        body: Joi.object({
            season: Joi.forbidden().messages({
                "any.unknown": "You cannot create the id"
            }),
            createdAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the creation date"
            }),
            updatedAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the last updated date"
            })
        })
    },
    getStandingsBySeason: {
        params: Joi.object({
            season: Joi.string().required().messages({
                "string.base": "Given season must be a string",
                "any.required": "Season is required Ex. (2000-2001)",
                "string.empty": "Season cannot be empty",
            })
        })
    },

}