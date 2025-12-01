import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as coachController from "../../src/api/nba/controllers/coachController";
import * as coachService from "../../src/api/nba/services/coachService";
import { Coach } from '../../src/api/nba/models/people/coachModel';

jest.mock("../../src/api/nba/services/coachService");

describe("Coach Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    const mockDate = new Date();


    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("createCoach", () => {

        it("Should return the correct HTTP status code and message with a valid input.", async () => {

            const mockBody = {
                name: "Phil Jackson",
                currentTeam: "Cancun Sharks"
            };

            mockReq.body = mockBody;
            (coachService.createCoach as jest.Mock).mockReturnValue(mockBody);

            await coachController.createCoach(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith( expect.objectContaining({
                status: "Success",
                message: "Coach created.",
            }));

        });

    });

    describe("getCoaches", () => {

        it("Should return correct HTTP status code and message when there are coaches.", async () => {
            const mockCoaches: Coach[] = [
                {
                    id: "1",
                    name: "Phil Jackson",
                    currentTeam: "Cancun Sharks",
                    createdAt: mockDate,
                    updatedAt: mockDate
                }
            ];

            (coachService.getCoaches as jest.Mock).mockReturnValue(mockCoaches);

            await coachController.getCoaches(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockCoaches,
                message: "Coaches found and returned.",
            });
        });
    });

    describe("getCoachById", () => {
        it("Return correct HTTP status code and data when coach exists", async () => {
            const expectedCoach: Coach = {
                id: "1",
                name: "Phil Jackson",
                currentTeam: "Cancun Sharks",
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (coachService.getCoachById as jest.Mock).mockReturnValue(expectedCoach);

            await coachController.getCoachById(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: expectedCoach,
                message: "Coach found",
            });
        });

    });

    describe("updateCoach", () => {
        it("Returned the correct HTTP status code and data when a coach is updated", async () => {
            const expectedCoach: Coach = {
                id: "1",
                name: "Phil Jackson",
                currentTeam: "Cancun Sharks",
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (coachService.updateCoach as jest.Mock).mockReturnValue(expectedCoach);

            await coachController.updateCoach(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Coach updated",
            }));

        });

    });

});

