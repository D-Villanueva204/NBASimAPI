import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as playerController from "../../src/api/nba/controllers/playerController";
import * as playerService from "../../src/api/nba/services/playerService";
import { Position } from "../../src/api/nba/models/people/playerModel";

jest.mock("../../src/api/nba/services/playerService");

describe("Player Controller", () => {
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

    describe("createPlayer", () => {

        it("Should return the correct HTTP status code and message with a valid input.", async () => {

            const mockBody = {
                name: "John Wall",
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12
            };

            mockReq.body = mockBody;
            (playerService.createPlayer as jest.Mock).mockReturnValue(mockBody);

            await playerController.createPlayer(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Player sent to Commissioner for Approval.",
            }));

        });

    });

    describe("getAllPlayers", () => {

        it("Should return correct HTTP status code and message when there are players.", async () => {
            const mockPlayers = [{
                name: "John Wall",
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate

            }];

            (playerService.getAllPlayers as jest.Mock).mockReturnValue(mockPlayers);

            await playerController.getAllPlayers(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockPlayers,
                message: "Players found and returned."
            });
        });
    });

    describe("getPlayers", () => {

        it("Should return correct HTTP status code and message when there are players.", async () => {
            const mockPlayers = [{
                name: "John Wall",
                status: true,
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate

            }];

            (playerService.getPlayers as jest.Mock).mockReturnValue(mockPlayers);

            await playerController.getPlayers(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockPlayers,
                message: "Players found and returned."
            });
        });
    });

    describe("getPendingPlayers", () => {

        it("Should return correct HTTP status code and message when there are pending players.", async () => {
            const mockPlayers = [{
                name: "John Wall",
                status: false,
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate

            }];

            (playerService.getPendingPlayers as jest.Mock).mockReturnValue(mockPlayers);

            await playerController.getPendingPlayers(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockPlayers,
                message: "Pending Players found and returned."
            });
        });
    });

    describe("getPlayerById", () => {
        it("Return correct HTTP status code and data when player exists", async () => {
            const expectedPlayer = {
                name: "John Wall",
                status: false,
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (playerService.getPlayerById as jest.Mock).mockReturnValue(expectedPlayer);

            await playerController.getPlayerById(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: expectedPlayer,
                message: "Player found",
            });
        });

    });

    describe("updatePlayer", () => {
        it("Returned the correct HTTP status code and data when a coach is updated", async () => {
            const expectedPlayer = {
                name: "John Wall",
                status: false,
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (playerService.updatePlayer as jest.Mock).mockReturnValue(expectedPlayer);

            await playerController.updatePlayer(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Player updated",
            }));

        });

    });

    describe("reviewPlayer", () => {
        it("Returned the correct HTTP status code and data when a game is reviewed", async () => {
            const expectedPlayer = {
                name: "John Wall",
                status: false,
                currentTeam: "Cancun Sharks",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (playerService.reviewPlayer as jest.Mock).mockReturnValue(expectedPlayer);

            await playerController.reviewPlayer(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Player status set.",
            }));

        });

    });

});

