import { Team } from 'src/api/nba/models/teamModel';
import * as firestoreRepository from '../src/api/nba/repositories/firestoreRepositories';
import * as teamService from "../src/api/nba/services/teamService";
// import { Team } from '../src/api/nba/models/teamModel';

jest.mock('../src/api/nba/repositories/firestoreRepositories');

describe("teamService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a Team with valid arguments", async () => {
        const mockInput = {
            name: "Cancun Sharks"
        };

        const result = await teamService.createTeam(mockInput);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith("teams", expect.objectContaining({
            name: "Cancun Sharks"
        }));

        expect(result.name).toBe(mockInput.name);

    });


    it("Should retrieve all teams if exists", async () => {
        const mockTeam = {
            id: "mexicoParadise",
            name: "Cancun Sharks"
        };

        const mockSnapshot = {
            docs: [
                {
                    id: "mexicoParadise",
                    data: () => mockTeam,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await teamService.getTeams();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("teams");

        expect(result).toEqual([mockTeam]);

    });

    it("should retrieve a team by id if exists", async () => {
        const mockId = "mexicoParadise";
        const mockDate = new Date();

        const mockTeam: Team = {
            id: mockId,
            name: "Lakers",
            pointGuard: null,
            shootingGuard: null,
            smallForward: null,
            powerForward: null,
            centre: null,
            record: undefined,
            coach: null,
            createdAt: mockDate,
            updatedAt: mockDate,
        };

        const mockSnapshot = {

            id: mockId,
            data: () => mockTeam,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await teamService.getTeamById(mockId);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("teams", mockId);
        expect(result.name).toBe(mockTeam.name);
        expect(result.id).toBe(mockTeam.id);
    });

    it("should update team name if exists with valid fields", async () => {
        const mockId = "mexicoParadise";
        const mockDate = new Date();

        const mockTeam = {
            id: mockId,
            name: "Lakers",
            pointGuard: null,
            shootingGuard: null,
            smallForward: null,
            powerForward: null,
            centre: null,
            record: undefined,
            coach: null,
            createdAt: mockDate,
            updatedAt: mockDate,
        };

        const expected = {
            ...mockTeam,
            name: "Cancun Sharks"
        };

        const mockBody = {
            newName: "Cancun Sharks"
        };

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(expected);
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            id: mockId,
            data: () => (mockTeam),
        });

        const result = await teamService.updateTeamName(mockId, "Cancun Sharks");

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("teams", mockId, expect.objectContaining({
            name: "Cancun Sharks"
        }));

        expect(result.name).toBe(mockBody.newName);


    });

});