import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as possessionsController from "../../src/api/nba/controllers/possessionsController";

jest.mock("../../src/api/nba/controllers/possessionsController", () => ({
    getPossessions: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

jest.mock("../../src/api/nba/middleware/authenticate", () => {
    return jest.fn((_req: any, _res: any, next: any) => next());
});

jest.mock("../../src/api/nba/middleware/authorize", () => {
    return jest.fn(() => (_req: any, _res: any, next: any) => next());
});

describe("Possessions Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("GET /api/nba/possessions/:id", () => {
        it("should only call the getPossessions controller", async () => {

            await request(app).get("/api/nba/possessions/:id");

            expect(possessionsController.getPossessions).toHaveBeenCalled();

        });
    });

});