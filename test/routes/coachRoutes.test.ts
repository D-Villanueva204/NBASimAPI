import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as coachController from "../../src/api/nba/controllers/coachController";

jest.mock("../../src/api/nba/controllers/coachController", () => ({
    createCoach: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getCoaches: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getCoachById: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updateCoach: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

jest.mock("../../src/api/nba/middleware/authenticate", () => {
    return jest.fn((_req: any, _res: any, next: any) => next());
});

jest.mock("../../src/api/nba/middleware/authorize", () => {
    return jest.fn(() => (_req: any, _res: any, next: any) => next());
});

describe("Coach Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/nba/coach", () => {
        it("should only call the createCoach controller", async () => {
            const mockCoach = {
                name: "Phil Jackson",
                currentTeam: "Cancun Sharks"
            };

            await request(app).post("/api/nba/coach").send(mockCoach);

            expect(coachController.createCoach).toHaveBeenCalled();
        });
    });

    describe("GET /api/nba/coach", () => {
        it("should only call the getCoaches controller", async () => {

            await request(app).get("/api/nba/coach");

            expect(coachController.getCoaches).toHaveBeenCalled();

        });
    });

    describe("GET /api/nba/coach:id", () => {
        it("should only call the getCoachById controller", async () => {

            await request(app).get("/api/nba/coach/1");

            expect(coachController.getCoachById).toHaveBeenCalled();

        });
    });

    describe("PUT /api/nba/coach:id", () => {
        it("should only call the updateCoach controller", async () => {

            const mockBody = {
                name: "David Fizdale"
            };

            await request(app).put("/api/nba/coach/1").send(mockBody);

            expect(coachController.updateCoach).toHaveBeenCalled();

        });
    });
});
