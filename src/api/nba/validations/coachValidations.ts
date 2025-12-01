import Joi from "joi";

export const coachSchemas = {
    create: {
        body: Joi.object({
            id: Joi.forbidden().messages({
                "any.unknown": "You cannot update the id"
            }),
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            position: Joi.string().optional().messages({
                "string.base": "Given position must be a string"
            }),
            currentTeam: Joi.string().optional().messages({
                "string.base": "Declared Team can only be with teamId"
            }),
            createdAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the creation date"
            }),
            updatedAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the last updated date"
            })
        })
    },

    getCoachById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "string.base": "Given id must be a string",
                "any.required": "Coach Id is required",
                "string.empty": "Coach Id cannot be empty",
            })
        })
    },

    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Coach Id is required",
                "string.empty": "Coach Id cannot be empty",
            })
        }),

        body: Joi.object({
            id: Joi.forbidden().messages({
                "any.unknown": "You cannot update the id"
            }),
            createdAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the creation date"
            }),
            updatedAt: Joi.forbidden().messages({
                "any.unknown": "You cannot update the last updated date"
            }),
            name: Joi.string().optional(),
            currentTeam: Joi.string().optional()
        })
    },
};