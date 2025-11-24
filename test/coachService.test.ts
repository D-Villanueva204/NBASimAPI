import * as firestoreRepository from '../src/api/nba/repositories/firestoreRepositories';
import * as coachService from "../src/api/nba/services/coachService";
import { Coach } from '../src/api/nba/models/people/coachModel';

jest.mock('../src/api/nba/repositories/firestoreRepositories');

describe("coachService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a Coach with valid arguments", async () => {
        const mockInput = {
            name: "Phil Jackson",
            currentTeam: "Cancun Sharks"
        };

        const result = await coachService.createCoach(mockInput);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith("coaches", expect.objectContaining({
            name: "Phil Jackson",
            currentTeam: "Cancun Sharks"
        }));

        expect(result.name).toBe(mockInput.name);
        expect(result.currentTeam).toBe(mockInput.currentTeam);


    });


    it("Should retrieve all coaches if exists", async () => {
        const mockCoach = {
            id: "13rings",
            name: "Phil Jackson",
            currentTeam: "Cancun Sharks"
        };

        const mockSnapshot = {
            docs: [
                {
                    id: "13rings",
                    data: () => mockCoach,
                },
            ],
        };

        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        const result = await coachService.getCoaches();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("coaches");

        expect(result).toEqual([mockCoach]);

    });

    it("should update coach if exists with valid fields", async () => {
        const mockId = "13rings";
        const mockDate = new Date();

        const mockCoach = {
            name: "Phil Jackson",
            currentTeam: "Chicago Bulls",
            createdAt: mockDate,
            updatedAt: mockDate,
        };

        const mockBody: Pick<Coach,
            "name" |
            "currentTeam"
        > = {
            ...mockCoach,
            currentTeam: "Los Angeles Lakers"

        };

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(mockCoach);

        const result = await coachService.updateCoach(mockId, mockBody);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("coaches", mockId, expect.objectContaining({
            currentTeam: "Los Angeles Lakers"
        }));

        expect(result.currentTeam).toBe(mockCoach.currentTeam);


    });

});