import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as playerController from "../../src/api/nba/controllers/playerController";
import { Position } from "../../src/api/nba/models/people/playerModel";

jest.mock("../../src/api/nba/controllers/playerController", () => ({
    createPlayer: jest.fn((_req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllPlayers: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getPlayers: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getPendingPlayers: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    getPlayerById: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    reviewPlayer: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send()),
    updatePlayer: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

jest.mock("../../src/api/nba/middleware/authenticate", () => {
    return jest.fn((_req: any, _res: any, next: any) => next());
});

jest.mock("../../src/api/nba/middleware/authorize", () => {
    return jest.fn(() => (_req: any, _res: any, next: any) => next());
});

describe("Player Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/nba/player/", () => {
        it("should only call the setupPlayer controller", async () => {
            const mockPlayer = {
                name: "John Wall",
                position: Position.PointGuard,
                possession: 99,
                three: 75,
                layup: 33,
                defense: 12,
            };

            await request(app).post("/api/nba/player/").send(mockPlayer);

            expect(playerController.createPlayer).toHaveBeenCalled();
        });
    });

    describe("GET /api/nba/player/admin/", () => {
        it("should only call the getAllPlayers controller", async () => {

            await request(app).get("/api/nba/player/admin/");

            expect(playerController.getAllPlayers).toHaveBeenCalled();

        });
    });

    describe("GET /api/nba/player/", () => {
        it("should only call the getPlayers controller", async () => {

            await request(app).get("/api/nba/player/");

            expect(playerController.getPlayers).toHaveBeenCalled();

        });
    });


    describe("GET /api/nba/player/pending/", () => {
        it("should only call the getPlayers controller", async () => {

            await request(app).get("/api/nba/player/pending/");

            expect(playerController.getPendingPlayers).toHaveBeenCalled();

        });
    });



    describe("GET /api/nba/player/:id", () => {
        it("should only call the getPlayerById controller", async () => {

            await request(app).get("/api/nba/player/1");

            expect(playerController.getPlayerById).toHaveBeenCalled();

        });
    });

    describe("PUT /api/nba/player/review/:id", () => {
        it("should only call the reviewPlayer controller", async () => {

            await request(app).put("/api/nba/player/review/1").send();

            expect(playerController.reviewPlayer).toHaveBeenCalled();

        });
    });

    describe("PUT /api/nba/player/update/:id", () => {
        it("should only call the updatePlayer controller", async () => {

            await request(app).put("/api/nba/player/update/1").send();

            expect(playerController.updatePlayer).toHaveBeenCalled();

        });
    });

});