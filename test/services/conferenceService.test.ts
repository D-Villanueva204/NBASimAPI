import * as conferenceService from "../../src/api/nba/services/conferenceService";
import * as teamService from "../../src/api/nba/services/teamService";
import { ConferenceType } from "../../src/api/nba/models/standingsSim/conferenceModel";

jest.mock("../../src/api/nba/services/teamService");

describe("conferenceService", () => {
    it("updateConferences returns proper top seed.", async () => {
        const mockTeams = [
            {
                id: "1",
                name: "Test East Team",
                conference: ConferenceType.easternConference,
                record: { wins: 10, losses: 5 }
            },
            {
                id: "2",
                name: "Test West Team",
                conference: ConferenceType.westernConference,
                record: { wins: 12, losses: 3 }
            }
        ];

        const expected = mockTeams[1];

        (teamService.getTeams as jest.Mock).mockResolvedValue(mockTeams);


        const result = await conferenceService.updateConferences();

        expect(result.topSeed.id).toBe(expected.id);
        expect(result.topSeed.name).toBe(expected.name);
    });
});
