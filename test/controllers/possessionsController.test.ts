import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as possessionsService from "../../src/api/nba/services/possessionsService";
import * as possessionsController from "../../src/api/nba/controllers/possessionsController";
import { Possession } from "../../src/api/nba/models/matchSim/possessionModel";

jest.mock("../../src/api/nba/services/possessionsService");

describe("Possession Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("getPossession", () => {
        it("Return correct HTTP status code and data when coach exists", async () => {
            const expectedPossession: Possession = {
                shot: 3,
                currentTeam: "Celtics",
                shooter: {
                    playerId: "hair",
                    name: "Jaylen Brown"
                },
                defender: {
                    playerId: "jb",
                    name: "Jalen Brunson"
                },
                rebound: {
                    playerId: "OG3",
                    name: "OG Anunoby"
                },
                assist: null
            };

            (possessionsService.getPossessions as jest.Mock).mockReturnValue(expectedPossession);

            await possessionsController.getPossessions(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: expectedPossession,
                message: "Match events returned",
            });
        })
    })
});
    