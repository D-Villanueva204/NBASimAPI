import * as firestoreRepository from '../../src/api/nba/repositories/firestoreRepositories';
import * as playerService from "../../src/api/nba/services/playerService";
import { Player, Position } from '../../src/api/nba/models/people/playerModel';

jest.mock('../../src/api/nba/repositories/firestoreRepositories');

describe("playerService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a Player with valid arguments", async () => {
        const mockInput = {
            name: "John Wall",
            currentTeam: "Cancun Sharks",
            position: Position.PointGuard,
            possession: 99,
            three: 75,
            layup: 33,
            defense: 12
        };

        const result = await playerService.createPlayer(mockInput);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith("players", expect.objectContaining({
            name: "John Wall",
            currentTeam: "Cancun Sharks",
            position: Position.PointGuard,
            possession: 99,
            three: 75,
            layup: 33,
            defense: 12
        }));

        expect(result.name).toBe(mockInput.name);
        expect(result.position).toBe(mockInput.position);
        expect(result.currentTeam).toBe(mockInput.currentTeam);
        expect(result.three).toBe(mockInput.three);
        expect(result.layup).toBe(mockInput.layup);
        expect(result.defense).toBe(mockInput.defense);


    });


    it("Should retrieve all players if exists", async () => {
        const mockPlayer = {
            id: "johnwall",
            name: "John Wall",
            currentTeam: "Cancun Sharks",
            position: Position.PointGuard,
            possession: 99,
            three: 75,
            layup: 33,
            defense: 12
        };

        const mockSnapshot = {
            docs: [
                {
                    id: "johnwall",
                    data: () => mockPlayer,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await playerService.getAllPlayers();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("players");

        expect(result).toEqual([mockPlayer]);

    });

    it("should retrieve a player by id if exists", async () => {
        const mockId = "johnwall";
        const mockPlayer = {
            name: "John Wall",
            currentTeam: "Cancun Sharks",
            position: Position.PointGuard,
            possession: 99,
            three: 75,
            layup: 33,
            defense: 12,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockSnapshot = {

            id: mockId,
            data: () => mockPlayer,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await playerService.getPlayerById(mockId);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("players", mockId);

        expect(result.name).toBe(mockPlayer.name);
        expect(result.position).toBe(mockPlayer.position);
        expect(result.currentTeam).toBe(mockPlayer.currentTeam);
        expect(result.three).toBe(mockPlayer.three);
        expect(result.layup).toBe(mockPlayer.layup);
        expect(result.defense).toBe(mockPlayer.defense);

    });

    it("should update player if exists with valid fields", async () => {
        const mockId = "johnwall";
        const mockDate = new Date();

        const mockPlayer = {
            id: mockId,
            name: "John Wall",
            currentTeam: "Washington Wizards",
            position: Position.PointGuard,
            possession: 99,
            three: 75,
            layup: 33,
            defense: 12,
            createdAt: mockDate,
            updatedAt: mockDate,
        };

        const mockBody: Pick<Player,
            "name" |
            "position" |
            "currentTeam" |
            "possession" |
            "three" |
            "layup" |
            "defense"> = {
            ...mockPlayer,
            currentTeam: "Cancun Sharks"

        };

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(mockPlayer);

        const result = await playerService.updatePlayer(mockId, mockBody);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("players", mockId, expect.objectContaining({
            currentTeam: "Cancun Sharks"
        }));

        expect(result.currentTeam).toBe(mockBody.currentTeam);


    });

});