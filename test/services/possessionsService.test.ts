import * as firestoreRepository from '../../src/api/nba/repositories/firestoreRepositories';
import * as possessionsService from "../../src/api/nba/services/possessionsService";

jest.mock('../../src/api/nba/repositories/firestoreRepositories');

describe("possessionsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create and return a Possessions object properly", async () => {
        const mockEvents = [
            {
                shot: 3,
                currentTeam: "Celtics",
                shooter: {
                    playerId: "hair",
                    name: "Jaylen Brown"
                },
                defender: {
                    playerId: "jb",
                    name: "Jalen Brunson"
                },
                rebound: {
                    playerId: "OG3",
                    name: "OG Anunoby"
                },
                assist: null
            }
        ];

        const mockId = "celticsPossession";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockId);

        await possessionsService.createPossessions(mockEvents);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith("possessions", expect.objectContaining({ events: mockEvents }));
    });

    it("should retrieve a possessions by id if exists", async () => {
        const mockId = "celticsPossession";
        const mockPossessions = {
            shot: 3,
            currentTeam: "Celtics",
            shooter: {
                playerId: "hair",
                name: "Jaylen Brown"
            },
            defender: {
                playerId: "jb",
                name: "Jalen Brunson"
            },
            rebound: {
                playerId: "OG3",
                name: "OG Anunoby"
            },
            assist: null
        };

        const mockSnapshot = {

            id: mockId,
            data: () => mockPossessions,

        };

        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockSnapshot);

        await possessionsService.getPossessions(mockId);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("possessions", mockId);

    });

})