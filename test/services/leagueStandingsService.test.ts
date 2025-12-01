import * as firestoreRepository from '../../src/api/nba/repositories/firestoreRepositories';
import * as leagueStandingsService from "../../src/api/nba/services/leagueStandingsService";
// import { LeagueStandings } from '../../src/api/nba/models/standingsSim/leagueStandingsModel';
import { updateConferences } from "../../src/api/nba/services/conferenceService";

jest.mock('../../src/api/nba/repositories/firestoreRepositories');
jest.mock("../../src/api/nba/services/conferenceService");

describe("leagueStandingsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const dateNow = new Date();
    const expectedSeason = `${dateNow.getFullYear()}-${(Number(dateNow.getFullYear()) + 1)}`;


    it("should create a LeagueStandings object", async () => {

        (updateConferences as jest.Mock).mockResolvedValue({
            easternConference: { conference: "East", teams: [] },
            westernConference: { conference: "West", teams: [] },
            topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } }
        });

        await leagueStandingsService.createNewStandings();

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith("standings", expect.objectContaining({
            season: expectedSeason,
            easternConference: { conference: "East", teams: [] },
            westernConference: { conference: "West", teams: [] },
            topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } }
        }), expectedSeason);
    });

    it("should retrieve an standings by season if exists", async () => {
        const mockStandings = {
            season: expectedSeason,
            easternConference: { conference: "East", teams: [] },
            westernConference: { conference: "West", teams: [] },
            topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
            createdAt: dateNow,
            updatedAt: dateNow,
        };

        const mockSnapshot = {

            id: expectedSeason,
            data: () => mockStandings,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await leagueStandingsService.getStandingsBySeason(expectedSeason);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("standings", expectedSeason);

        expect(result.season).toBe(expectedSeason);
        expect(result.topSeed).toEqual(mockStandings.topSeed);
        expect(result.westernConference).toEqual(mockStandings.westernConference);
        expect(result.easternConference).toEqual(mockStandings.easternConference);
    });

    it("Should retrieve all standings if exists", async () => {
        const mockStandings = {
            season: expectedSeason,
            easternConference: { conference: "East", teams: [] },
            westernConference: { conference: "West", teams: [] },
            topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
            createdAt: dateNow,
            updatedAt: dateNow,
        };

        const mockSnapshot = {
            docs: [
                {
                    id: expectedSeason,
                    data: () => mockStandings,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await leagueStandingsService.getStandings();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("standings");

        expect(result).toEqual([mockStandings]);

    });

    it("should retrieve return proper fields on update", async () => {
        const mockStandings = {
            season: expectedSeason,
            easternConference: { conference: "East", teams: [] },
            westernConference: { conference: "West", teams: [] },
            topSeed: { id: "1", name: "Test Team", record: { wins: 10, losses: 0 } },
            createdAt: dateNow,
            updatedAt: dateNow,
        };

        const mockSnapshot = {

            id: expectedSeason,
            data: () => mockStandings,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await leagueStandingsService.updateStandings(expectedSeason);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("standings", expectedSeason);

        expect(result.season).toBe(expectedSeason);
        expect(result.topSeed).toEqual(mockStandings.topSeed);
        expect(result.westernConference).toEqual(mockStandings.westernConference);
        expect(result.easternConference).toEqual(mockStandings.easternConference);
    });

});