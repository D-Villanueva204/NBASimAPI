import Joi from "joi";

export const matchSchemas = {
    setupMatch: {
        body: Joi.object({
            homeTeam: Joi.string()
                .required().messages({
                    "any.required": "homeTeam Team ID is required",
                    "string.empty": "homeTeam Team ID cannot be empty"
                }),
            awayTeam: Joi.string()
                .required().messages({
                    "any.required": "awayTeam Team ID is required",
                    "string.empty": "awayTeam Team ID cannot be empty"
                })
        })
    },
    getMatch: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Match Id is required",
                "string.empty": "Match Id cannot be empty",
            })
        })
    },
    playMatch: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Match Id is required",
                "string.empty": "Match Id cannot be empty",
            })
        })
    },
    reviewMatch: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Match Id is required",
                "string.empty": "Match Id cannot be empty",
            })
        })
    }
}