import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as conferenceController from "../../src/api/nba/controllers/conferenceController";
jest.mock("../../src/api/nba/services/conferenceService");

describe("Conference Controller", () => {
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

    describe("updateConferences", () => {
        it("Returns the correct HTTP status code and data when a conference is updated", async () => {

            await conferenceController.updateConferences(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Conferences updated.",
            }));

        });

    });

});

