import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as matchController from "../../src/api/nba/controllers/matchController";
import * as matchService from "../../src/api/nba/services/matchService";

jest.mock("../../src/api/nba/services/matchService");

describe("Match Controller", () => {
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

    describe("setupMatch", () => {

        it("Should return the correct HTTP status code and message with a valid input.", async () => {

            const mockBody = {
                homeTeam: "homeTeam",
                awayTeam: "awayTeam"
            };

            mockReq.body = mockBody;
            (matchService.setupMatch as jest.Mock).mockReturnValue(mockBody);

            await matchController.setupMatch(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Game sent to Commissioner for Approval.",
            }));

        });

    });

    describe("getMatches", () => {

        it("Should return correct HTTP status code and message when there are matches.", async () => {
            const mockMatches = [{
                played: false,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate

            }];

            (matchService.getMatches as jest.Mock).mockReturnValue(mockMatches);

            await matchController.getMatches(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockMatches,
                message: "All pending matches found and returned.",
            });
        });
    });

    describe("getMatches", () => {

        it("Should return correct HTTP status code and message when there are games.", async () => {
            const mockGames = [{
                played: false,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate

            }];

            (matchService.getGames as jest.Mock).mockReturnValue(mockGames);

            await matchController.getMatches(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockGames,
                message: "All pending matches found and returned.",
            });
        });
    });

    describe("getMatch", () => {
        it("Return correct HTTP status code and data when match exists", async () => {
            const expectedMatch = {
                played: false,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate
            };

            (matchService.getMatch as jest.Mock).mockReturnValue(expectedMatch);

            await matchController.getMatch(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: expectedMatch,
                message: "Match found",
            });
        });

    });

    describe("playMatch", () => {
        it("Returned the correct HTTP status code and data when a game is played", async () => {
            const expectedMatch = {
                played: true,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate
            };

            (matchService.playMatch as jest.Mock).mockReturnValue(expectedMatch);

            await matchController.playMatch(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Game played",
            }));

        });

    });

    describe("reviewMatch", () => {
        it("Returned the correct HTTP status code and data when a game is reviewed", async () => {
            const expectedMatch = {
                played: true,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate
            };

            (matchService.reviewMatch as jest.Mock).mockReturnValue(expectedMatch);

            await matchController.reviewMatch(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Game reviewed and removed.",
            }));

        });

    });

});

