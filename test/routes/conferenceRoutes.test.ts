import request from "supertest";
import app from "../../src/app";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import * as conferenceController from "../../src/api/nba/controllers/conferenceController"

jest.mock("../../src/api/nba/controllers/conferenceController", () => ({
    updateConferences: jest.fn((_req, res) => res.status(HTTP_STATUS.OK).send())
}));

describe("Conference Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

 describe("PUT /api/nba/conference", () => {
        it("should only call the updateConferences controller", async () => {

            await request(app).put("/api/nba/conference");

            expect(conferenceController.updateConferences).toHaveBeenCalled();

        });
    });



})