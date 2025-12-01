import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../src/api/nba/constants/httpConstants";
import { LeagueStandings } from "../../src/api/nba/models/standingsSim/leagueStandingsModel"
import * as leagueStandingsService from "../../src/api/nba/services/leagueStandingsService";
import * as leagueStandingsController from "../../src/api/nba/controllers/leagueStandingsController";
import { ConferenceType } from "../../src/api/nba/models/standingsSim/conferenceModel";
jest.mock("../../src/api/nba/services/leagueStandingsService");

describe("Conference Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    const mockDate = new Date();
    const expectedSeason = `${mockDate.getFullYear()}-${(Number(mockDate.getFullYear()) + 1)}`;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("createNewStandings", () => {
        it("Returns the correct HTTP status code and data when a leagueStandings is created", async () => {

            await leagueStandingsController.createNewStandings(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Standings created for new season.",
            }));

        });


    });

    describe("getStandings", () => {
        it("Should return correct HTTP status code and message when there are coaches.", async () => {
            const mockStandings: LeagueStandings[] = [
                {
                    season: expectedSeason,
                    easternConference: { conference: ConferenceType.easternConference, teams: [] },
                    westernConference: { conference: ConferenceType.westernConference, teams: [] },
                    topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
                    createdAt: mockDate,
                    updatedAt: mockDate
                }
            ];

            (leagueStandingsService.getStandings as jest.Mock).mockReturnValue(mockStandings);

            await leagueStandingsController.getStandings(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: mockStandings,
                message: "All standings retrieved."
            });
        });

    });

    describe("getStandingsBySeason", () => {
        it("Return correct HTTP status code and data when standings exists", async () => {
            const expectedLeagueStandings: LeagueStandings = {
                season: expectedSeason,
                easternConference: { conference: ConferenceType.easternConference, teams: [] },
                westernConference: { conference: ConferenceType.westernConference, teams: [] },
                topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (leagueStandingsService.getStandingsBySeason as jest.Mock).mockReturnValue(expectedLeagueStandings);

            await leagueStandingsController.getStandingsBySeason(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "Success",
                data: expectedLeagueStandings,
                message: "Standings found."
            });
        });

    });

    describe("updateStandings", () => {
        it("Returned the correct HTTP status code and data when standings are updated", async () => {
            const expectedLeagueStandings: LeagueStandings = {
                season: expectedSeason,
                easternConference: { conference: ConferenceType.easternConference, teams: [] },
                westernConference: { conference: ConferenceType.westernConference, teams: [] },
                topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (leagueStandingsService.updateStandings as jest.Mock).mockReturnValue(expectedLeagueStandings);

            await leagueStandingsController.updateStandings(mockReq as Request, mockRes as Response, mockNext as NextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "Success",
                message: "Standings updated."
            }));

        });

    });




});
