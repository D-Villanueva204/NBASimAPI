import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as leagueStandingsController from "../../src/api/nba/controllers/leagueStandingsController";

jest.mock("../../src/api/nba/controllers/leagueStandingsController", () => ({
    createNewStandings: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getStandings: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getStandingsBySeason: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updateStandings: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

jest.mock("../../src/api/nba/middleware/authenticate", () => {
    return jest.fn((_req: any, _res: any, next: any) => next());
});

jest.mock("../../src/api/nba/middleware/authorize", () => {
    return jest.fn(() => (_req: any, _res: any, next: any) => next());
});

describe("Standings Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/nba/standings", () => {
        it("should only call the createNewStandings controller", async () => {

            await request(app).post("/api/nba/standings").send();

            expect(leagueStandingsController.createNewStandings).toHaveBeenCalled();
        });
    });

    describe("GET /api/nba/standings", () => {
        it("should only call the getCoaches controller", async () => {

            await request(app).get("/api/nba/standings");

            expect(leagueStandingsController.getStandings).toHaveBeenCalled();

        });
    });

    describe("GET /api/nba/standings:id", () => {
        it("should only call the getStandingsBySeason controller", async () => {

            await request(app).get("/api/nba/standings/1");

            expect(leagueStandingsController.getStandingsBySeason).toHaveBeenCalled();

        });
    });

    describe("PUT /api/nba/standings:id", () => {
        it("should only call the updateStandings controller", async () => {

            await request(app).put("/api/nba/standings/1").send();

            expect(leagueStandingsController.updateStandings).toHaveBeenCalled();

        });
    });

});