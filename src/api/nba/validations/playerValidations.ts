import Joi from "joi";
import { Position } from "../models/people/playerModel";

export const playerSchemas = {
    create: {
        body: Joi.object({
            id: Joi.forbidden().messages({
                "any.unknown": "You cannot update the id"
            }),
            name: Joi.string().min(2).max(100).required().messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 2 characters long",
                "string.max": "Name must not exceed 100 characters",
                "any.required": "Name is required"
            }),

            currentTeam: Joi.string().optional().messages({
                "string.base": "Current team must be a string"
            }),

            position: Joi.string()
                .valid(Position.Centre, Position.PowerForward, Position.SmallForward, Position.ShootingGuard, Position.PointGuard)
                .required().messages({
                    "string.empty": "Position is required",
                    "any.only": "Position must be a valid Position Type",
                    "any.required": "Position is required"
                }),

            possession: Joi.number()
                .min(0).max(100).required().messages({
                    "number.base": "Possession must be a number",
                    "number.min": "Possession must be at least 0",
                    "number.max": "Possession must not exceed 100",
                    "any.required": "Possession is required"
                }),

            three: Joi.number()
                .min(0).max(100).required().messages({
                    "number.base": "Three-point rating must be a number",
                    "number.min": "Three-point rating must be at least 0",
                    "number.max": "Three-point rating must not exceed 100",
                    "any.required": "Three-point rating is required"
                }),

            layup: Joi.number()
                .min(0).max(100).required().messages({
                    "number.base": "Layup rating must be a number",
                    "number.min": "Layup rating must be at least 0",
                    "number.max": "Layup rating must not exceed 100",
                    "any.required": "Layup rating is required"
                }),

            defense: Joi.number()
                .min(0).max(100).required().messages({
                    "number.base": "Defense rating must be a number",
                    "number.min": "Defense rating must be at least 0",
                    "number.max": "Defense rating must not exceed 100",
                    "any.required": "Defense rating is required"
                })
        })
    },
    update: {
        body: Joi.object({
            name: Joi.string().min(2).max(100).optional().messages({
                "string.min": "Name must be at least 2 characters long",
                "string.max": "Name must not exceed 100 characters"
            }),

            currentTeam: Joi.string().optional().messages({
                "string.base": "Current team must be a string"
            }),

            position: Joi.string().valid(Position.Centre, Position.PowerForward, Position.SmallForward, Position.ShootingGuard, Position.PointGuard)
                .optional().messages({
                    "any.only": "Position must be a valid Position Type"
                }),

            possession: Joi.number()
                .min(0).max(100).optional().messages({
                    "number.base": "Possession must be a number",
                    "number.min": "Possession must be at least 0",
                    "number.max": "Possession must not exceed 100"
                }),

            three: Joi.number()
                .min(0).max(100).optional().messages({
                    "number.base": "Three-point rating must be a number",
                    "number.min": "Three-point rating must be at least 0",
                    "number.max": "Three-point rating must not exceed 100"
                }),

            layup: Joi.number().min(0).max(100).optional().messages({
                "number.base": "Layup rating must be a number",
                "number.min": "Layup rating must be at least 0",
                "number.max": "Layup rating must not exceed 100"
            }),

            defense: Joi.number().min(0).max(100).optional().messages({
                "number.base": "Defense rating must be a number",
                "number.min": "Defense rating must be at least 0",
                "number.max": "Defense rating must not exceed 100"
            })
        })
    },
    getPlayerById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "string.base": "Given id must be a string",
                "any.required": "Player Id is required",
                "string.empty": "Player Id cannot be empty",
            })
        })
    },
    reviewPlayer: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "string.base": "Given id must be a string",
                "any.required": "Player Id is required",
                "string.empty": "Player Id cannot be empty",
            })
        }),
        body: Joi.object({
            approved: Joi.boolean()
                .required()
                .messages({
                    "boolean.base": "Approved must be a boolean value",
                    "any.required": "Approved status is required"
                })
        })
    },
};
