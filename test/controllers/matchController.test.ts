import * as firestoreRepository from '../../src/api/nba/repositories/firestoreRepositories';
import * as matchService from "../../src/api/nba/services/matchService";
import { Match } from '../../src/api/nba/models/matchSim/matchModel';
import * as teamService from "../../src/api/nba/services/teamService"

jest.mock('../../src/api/nba/repositories/firestoreRepositories');
jest.mock("../../src/api/nba/services/teamService");

describe("matchService", () => {

    const mockDate: Date = new Date();

    let mockHomeTeam = "homeTeam";



    let mockAwayTeam = "awayTeam"



    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a Match with valid arguments", async () => {

        (teamService.getTeamById as jest.Mock).mockImplementation(
            (id: string) => {
                if (id === "LA Lakers") return mockAwayTeam;
                if (id === "Boston Celtics") return mockHomeTeam;
            });

        const input = { awayTeam: "LA Lakers", homeTeam: "Boston Celtics" };

        await matchService.setupMatch(input);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "matches",
            expect.objectContaining({
                awayTeam: undefined,
                homeTeam: undefined,
                played: false
            })
        );
    });


    it("should retrieve all pending matches if they exist", async () => {

        const mockMatch = {
            matchId: "match1",
            played: true,
            approved: false,
            homeTeam: mockHomeTeam,
            awayTeam: mockAwayTeam,
            possessions: null,
            createdAt: mockDate,
        };

        const mockSnapshot = {
            docs: [
                {
                    id: mockMatch.matchId,
                    data: () => mockMatch,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await matchService.getMatches();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("matches");
        expect(result).toEqual([mockMatch]);
    });

    it("should retrieve all games if they exist", async () => {

        const mockMatch = {
            matchId: "match1",
            played: true,
            approved: false,
            homeTeam: mockHomeTeam,
            awayTeam: mockAwayTeam,
            possessions: null,
            createdAt: mockDate,
        };

        const mockSnapshot = {
            docs: [
                {
                    id: mockMatch.matchId,
                    data: () => mockMatch,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await matchService.getGames();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("archived");
        expect(result).toEqual([mockMatch]);
    });



    it("should return a Match type object and change status when refused", async () => {
        const mockMatch = {
            matchId: "match1",
            played: true,
            approved: true,
            homeTeam: mockHomeTeam,
            awayTeam: mockAwayTeam,
            possessions: null,
            createdAt: mockDate,
        };

        const mockDoc = {

            id: mockMatch.matchId,
            data: () => mockMatch,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

        const result: Match = await matchService.reviewMatch("match1", false);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("matches", "match1");
        expect(result).toEqual(expect.objectContaining({
            matchId: "match1",
            played: true,
            approved: false,
            homeTeam: mockHomeTeam,
            awayTeam: mockAwayTeam,
            possessions: null
        }));


    });

});