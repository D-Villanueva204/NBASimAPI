import Joi from "joi";
import { ConferenceType } from "../models/standingsSim/conferenceModel";

export const TeamSchemas = {
    create: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Player Id is required",
                "string.empty": "Player Id cannot be empty",
            })
        }),
        body: Joi.object({
            name: Joi.string().min(2).max(50).required().messages({
                "string.empty": "Team name is required.",
                "string.min": "Team name must be at least 2 characters.",
                "string.max": "Team name cannot exceed 50 characters.",
                "any.required": "Team name is required."
            }),

            conference: Joi.string()
                .valid(ConferenceType.easternConference, ConferenceType.westernConference)
                .required().messages({
                    "any.only": "Conference must be a ConferenceType",
                    "any.required": "Conference is required."
                })
        })
    },

    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "string.base": "Given id must be a string",
                "any.required": "Team Id is required",
                "string.empty": "Team Id cannot be empty",
            })
        })
    },
    updateTeamName: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Player Id is required",
                "string.empty": "Player Id cannot be empty",
            })
        }),
        body: Joi.object({
            newName: Joi.string()
                .min(2)
                .max(50)
                .required()
                .messages({
                    "string.empty": "New team name is required.",
                    "string.min": "Team name must be at least 2 characters.",
                    "string.max": "Team name cannot exceed 50 characters.",
                    "any.required": "New team name is required."
                })
        }),
    },

    updatePlayer: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Team Id is required",
                "string.empty": "Team Id cannot be empty",
            })
        }),
        body: Joi.object({
            playerId: Joi.string()
                .required().messages({
                    "any.required": "Player ID is required",
                    "string.empty": "Player ID cannot be empty"
                })
        }),
    },

    assignCoach: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Team Id is required",
                "string.empty": "Team Id cannot be empty",
            })
        }),
        body: Joi.object({
            coachId: Joi.string()
                .required()
                .messages({
                    "string.empty": "Coach ID is required.",
                    "any.required": "Coach ID is required."
                })
        }),
    },


    deletePlayer: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Team Id is required",
                "string.empty": "Team Id cannot be empty",
            })
        }),
        body: Joi.object({
            playerId: Joi.string()
                .required()
                .messages({
                    "string.empty": "Player ID is required.",
                    "any.required": "Player ID is required."
                })
        }),
    }
};

