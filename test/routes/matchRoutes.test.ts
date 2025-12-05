import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as matchController from "../../src/api/nba/controllers/matchController";

jest.mock("../../src/api/nba/controllers/matchController", () => ({
    setupMatch: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getMatches: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getGames: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getMatch: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    playMatch: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    reviewMatch: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

jest.mock("../../src/api/nba/middleware/authenticate", () => {
    return jest.fn((_req: any, _res: any, next: any) => next());
});

jest.mock("../../src/api/nba/middleware/authorize", () => {
    return jest.fn(() => (_req: any, _res: any, next: any) => next());
});

describe("Match Routes", () => {
    const mockDate = new Date();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/nba/matches", () => {
        it("should only call the setupMatch controller", async () => {
            const mockMatch = {
                matchId: "match-1",
                played: false,
                approved: false,
                homeTeam: "Lakers",
                awayTeam: "Celtics",
                possessions: "abc123",
                createdAt: mockDate
            };

            await request(app).post("/api/nba/matches").send(mockMatch);

            expect(matchController.setupMatch).toHaveBeenCalled();
        });
    });

    describe("GET /api/nba/matches/pending", () => {
        it("should only call the getMatches controller", async () => {

            await request(app).get("/api/nba/matches/pending");

            expect(matchController.getMatches).toHaveBeenCalled();

        });
    });

    describe("GET /api/nba/matches/", () => {
        it("should only call the getGames controller", async () => {

            await request(app).get("/api/nba/matches/");

            expect(matchController.getGames).toHaveBeenCalled();

        });
    });

    describe("GET /api/nba/matches/pending/:id", () => {
        it("should only call the getMatch controller", async () => {

            await request(app).get("/api/nba/matches/pending/1");

            expect(matchController.getMatch).toHaveBeenCalled();

        });
    });

    describe("POST /api/nba/matches/play/:id", () => {
        it("should only call the playMatch controller", async () => {

            await request(app).post("/api/nba/matches/play/1").send();

            expect(matchController.playMatch).toHaveBeenCalled();

        });
    });

    describe("PUT /api/nba/matches/review/:id", () => {
        it("should only call the reviewMatch controller", async () => {

            await request(app).put("/api/nba/matches/review/1").send();

            expect(matchController.reviewMatch).toHaveBeenCalled();

        });
    });

});