// Imports
import { Match, archivedMatch } from "../models/matchSim/matchModel";
import { Possession, Possessions } from "../models/matchSim/possessionModel";
import { Team } from "../models/teamModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from "../repositories/firestoreRepositories";
import * as teamService from "../services/teamService"
import * as possessionsService from "../services/possessionsService"
import * as leagueStandingsService from "../services/leagueStandingsService";
import { Player } from "../models/people/playerModel";
import { Shot } from "../models/matchSim/shotModel";
import { BoxScore, Row } from "../models/matchSim/boxScoreModel";

const MATCHES_COLLECTION: string = "matches";
const ARCHIVED_MATCHES_COLLECTION: string = "archived";
const dateNow = new Date();

/**
 * Service for setupMatch. Meant for admin approval.
 * Schedules match between two teams.
 * 
 * @param matchData requires {homeTeam, awayTeam} Team id's.
 * @returns pending match.
 */
export const setupMatch = async (matchData: {
    awayTeam: string,
    homeTeam: string
}): Promise<Match> => {
    try {
        const returnedAwayTeam = await teamService.getTeamById(matchData.awayTeam);
        const returnedHomeTeam = await teamService.getTeamById(matchData.homeTeam);

        const newMatch: Partial<Match> = {
            awayTeam: returnedAwayTeam.id,
            homeTeam: returnedHomeTeam.id,
            played: false,
            createdAt: dateNow
        };

        const matchId: string = await createDocument<Match>(MATCHES_COLLECTION, newMatch);

        return structuredClone({ id: matchId, ...newMatch } as Match);

    } catch (error: unknown) {
        throw error;
    }

};

/**
 * Admin use only. Retrieves all matches pending.
 * 
 * @returns all matches pending.
 */
export const getMatches = async (): Promise<Match[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(MATCHES_COLLECTION);
        const matches: Match[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                matchId: doc.id,
                ...data,
                createdAt: data.createdAt
            } as Match;
        });

        if (matches.length == 0) {
            throw new Error("No matches found");
        }

        return matches;
    } catch (error: unknown) {
        throw error;
    }

};

/**
 * General use. Retrieves all approved, played matches.
 * 
 * @returns all games played.
 */
export const getGames = async (): Promise<archivedMatch[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(ARCHIVED_MATCHES_COLLECTION);
        const games: archivedMatch[] = snapshot.docs.map(doc => {
            const data: DocumentData = doc.data();
            return {
                matchId: doc.id,
                ...data,
                createdAt: data.createdAt,
                finishedAt: data.finishedAt
            } as archivedMatch;
        });

        if (games.length == 0) {
            throw new Error("No games found");
        }

        return games;
    } catch (error: unknown) {
        throw error;
    }

};

/**
 * Admin use. Retrieved pending match.
 * 
 * @param matchId id to retrieve pending match
 * @returns match retrieved.
 */
export const getMatch = async (matchId: string): Promise<Match> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            MATCHES_COLLECTION,
            matchId
        );

        if (!doc) {
            throw new Error(`No match with id ${matchId} found.`);
        }

        const data: DocumentData | undefined = doc.data();
        const match: Match = {
            matchId: doc.id,
            ...data
        } as Match;

        return structuredClone(match);

    }
    catch (error: unknown) {
        throw error;
    }

};

/**
 * Coach or Admin use. Plays match.
 * 
 * @param matchId match to play.
 * @returns updated match,
 */
export const playMatch = async (matchId: string): Promise<Match> => {
    try {
        // Get the match
        const playedMatch: Match = await getMatch(matchId);
        // Generate Possessions.
        playedMatch.possessions = (await generatePossessions(playedMatch)).id;
        // Match is still not approved, but still played.
        playedMatch.approved = false;
        playedMatch.played = true;
        // Update to matches collection.
        await updateDocument<Match>(MATCHES_COLLECTION, matchId, playedMatch);

        return structuredClone(playedMatch);
    }
    catch (error: unknown) {
        throw error
    }

};

/**
 * Admin use only. Generates possessions for match.
 * 
 * @param match match to generate possessions for.
 * @returns game events of match.
 */
const generatePossessions = async (match: Match): Promise<Possessions> => {
    // Will be returned at the end
    const gameEvents: Possession[] = [];

    // Jumpball, random number I think.
    let homeTeam: Team = await teamService.getTeamById(match.homeTeam);
    let awayTeam: Team = await teamService.getTeamById(match.awayTeam);
    let teamOrder: Team[] = Math.random() < 0.5 ? [homeTeam, awayTeam] : [awayTeam, homeTeam];

    // Chooses first team to shoot.
    let currentTeam = teamOrder[0];

    // Runs 111 times.
    for (let i = 0; i <= 110; i++) {
        // Determine team to play determines
        let secondTeam: Team = (teamOrder.indexOf(currentTeam) === 0)
            ? teamOrder[1] : teamOrder[0];

        // Push to gameEvents Possessions array.
        gameEvents.push(generatePossession(currentTeam, secondTeam));

        // Change the team to shoot.
        currentTeam = (teamOrder.indexOf(currentTeam) === 1)
            ? teamOrder[0] : teamOrder[1];
    }

    // Once loop finished, create new Possessions object.
    const newPossessions = await possessionsService.createPossessions(gameEvents);

    // Return Possessions.
    return newPossessions;

};

/**
 * Internal use only. Generates game event.
 * 
 * @param offense team to play offense
 * @param defense team to play defense
 * @returns Outcome of possession.
 */
const generatePossession = (offense: Team, defense: Team): Possession => {
    // Variables.
    // Players involved in possessions
    let shooter;
    let defender;
    let rebounder;
    let assist;
    // Shot is always default a miss.
    let shot: Shot = Shot.MISS;
    // The probability of the shot made.
    let shotProbability: number;

    // Offense team players
    const offensePlayers: Player[] = [
        offense.pointGuard!,
        offense.shootingGuard!,
        offense.smallForward!,
        offense.powerForward!,
        offense.centre!];
    // Defense team players.
    const defensePlayers: Player[] = [
        defense.pointGuard!,
        defense.shootingGuard!,
        defense.smallForward!,
        defense.powerForward!,
        defense.centre!];
    // Offense team 'possession' stats.
    const possessionProbability: number[] = [
        offense.pointGuard!.possession,
        offense.shootingGuard!.possession,
        offense.smallForward!.possession,
        offense.powerForward!.possession,
        offense.centre!.possession];

    // Add all the possession stats into a single number.
    const totalSum: number = possessionProbability.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Generate a random number from 0 to that totalSum.
    let randomNum = Math.random() * totalSum;

    // Iterate through players. 
    for (const player of offensePlayers) {
        // Removes the player's possession stat from the random number.
        randomNum -= player.possession;
        // If the possession stat is larger than the randomNum, then they will shoot.
        // The player on the defensive team with the same position plays defense.
        if (randomNum <= 0) {
            shooter = player;
            defender = defensePlayers[offensePlayers.indexOf(shooter)];
            break;
        }
    }

    // Generate which shot it will be.
    const oneToThree = Math.floor(Math.random() * 3) + 1;

    // Depending on the shot..
    // if it is a miss, then a rebounder from the defense is randomly chosen.
    // If it is a make, then a probability based off of the 
    // offensive player's shot is calculated off of that corresponding stat (three, layup)
    // Against the defensive player's defense stat.
    switch (oneToThree) {
        case 1:
            shot = Shot.MISS
            rebounder = defensePlayers[Math.floor(Math.random() * defensePlayers.length)];
            assist = null;
            break;
        case 2:
            shot = Shot.LAYUP
            shotProbability = (shooter!.layup - (defender!.defense * 0.15));
            break;
        case 3:
            shot = Shot.THREE
            shotProbability = (shooter!.three - (defender!.defense * 0.25));
            break;
    };

    // If it is not a miss, 
    if (shot !== Shot.MISS) {
        // Roll number from 0 to 100.
        const roll = Math.floor(Math.random() * 100);
        // If the shotProbability is higher than the roll, it is made.
        const madeBasket = (shotProbability! > roll) ? true : false;
        if (!madeBasket) {
            // If lower than roll, credited as a miss. Calculate rebounder. No assist rewarded.
            shot = Shot.MISS;
            rebounder = defensePlayers[Math.floor(Math.random() * defensePlayers.length)];
            assist = null;
        } else {
            // If made, assist is rewarding to random player on offense team that's not the
            // shooter. No rebounder awarded.
            let noShooter = structuredClone(offensePlayers);
            noShooter.splice(offensePlayers.indexOf(shooter!), 1);
            assist = noShooter[Math.floor(Math.random() * noShooter.length)];
            rebounder = null;
        }
    }

    // Assign a new Possession object.
    let newPossession: Possession;
    // If made or miss, populate newPossession.
    if (assist) {
        newPossession = {
            currentTeam: offense.id,
            shooter: {
                playerId: shooter!.id,
                name: shooter!.name

            },
            defender: {
                playerId: defender!.id,
                name: defender!.name
            },
            shot: shot,
            rebound: null,
            assist: {
                playerId: assist.id,
                name: assist!.name
            }
        };
        return newPossession;

    }
    else {
        newPossession = {
            currentTeam: offense.id,
            shooter: {
                playerId: shooter!.id,
                name: shooter!.name

            },
            defender: {
                playerId: defender!.id,
                name: defender!.name
            },
            shot: shot,
            rebound: {
                playerId: rebounder!.id,
                name: rebounder!.name
            },
            assist: null
        };

        return newPossession;
    }


}

/**
 * Internal use. Reviews match and determines outcome.
 * Converts Match into archivedMatch if approved.
 * Delete Match if disapproved.
 * 
 * @param matchId 
 * @param approved 
 * @returns 
 */
export const reviewMatch = async (matchId: string, approved: boolean): Promise<Match | archivedMatch> => {
    try {
        // Get the match.
        const pendingMatch: Match = await getMatch(matchId);

        // If doesn't exist, throw error.
        if (!pendingMatch) {
            throw new Error(`No match with id ${matchId} found.`);
        };

        // If approved..
        if (approved) {
            // Calculate the winner, individual player stats, and 
            // converted to archivedMatch
            const calculatedMatch = await calculateScore(pendingMatch);

            // Populate new archivedMatch with new approved status
            const approvedMatch: archivedMatch = {
                ...calculatedMatch,
                approved: approved

            }

            // Update team record for winner.
            await teamService.updateRecord(approvedMatch.outcome.winner, true);

            // Update team record for loser.
            if (approvedMatch.outcome.winner === approvedMatch.homeTeam) {
                await teamService.updateRecord(approvedMatch.awayTeam, false);
            }
            else {
                await teamService.updateRecord(approvedMatch.homeTeam, false);
            }

            // Update to archivedMatches.
            await createDocument<archivedMatch>(ARCHIVED_MATCHES_COLLECTION, approvedMatch);

            // Delete from matches collection
            await deleteDocument(MATCHES_COLLECTION, matchId);

            // Grab season
            const season = (`${dateNow.getFullYear()}-${Number(dateNow.getFullYear()) + 1}`);

            // Update the leagueStandings with season.
            await leagueStandingsService.updateStandings(season);

            // Return approvedMatch
            return structuredClone(approvedMatch);
        }
        else {
            // Gets match.
            const disapprovedMatch: Match = await getMatch(matchId);
            disapprovedMatch.approved = false;

            // Delete from matches collection
            await deleteDocument(MATCHES_COLLECTION, matchId);

            return structuredClone(disapprovedMatch);
        };

    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Internal use. Calculates score and converts Match to
 * archivedMatch
 * 
 * @param match match to parse.
 * @returns archivedMatch
 */
const calculateScore = async (match: Match): Promise<archivedMatch> => {
    let awayScore = 0;
    let homeScore = 0;
    let homeTeamRows = structuredClone(calculateRows(await teamService.getTeamById(match.homeTeam)));
    let awayTeamRows = structuredClone(calculateRows(await teamService.getTeamById(match.awayTeam)));
    let boxScore: BoxScore = { awayTeam: awayTeamRows, homeTeam: homeTeamRows };

    // Grab game events.
    const gameEvents: Possession[] = (await possessionsService.getPossessions(match.possessions)).events;

    for (const gameEvent of gameEvents) {
        // Grab teams and populate Row
        const offenseTeamRows: Row[] =
            (gameEvent.currentTeam == match.homeTeam) ? homeTeamRows : awayTeamRows;
        const defenseTeamRows: Row[] =
            (gameEvent.currentTeam == match.homeTeam) ? awayTeamRows : homeTeamRows;

        // Grab Shooter and increment points for his row.
        offenseTeamRows[findRowIndexForPlayer(offenseTeamRows, gameEvent.shooter.playerId)].points += gameEvent.shot;

        // If homeTeam, increment home team score.
        // If awayTeam, increment away team score.
        if (gameEvent.currentTeam == match.homeTeam) {
            homeScore += gameEvent.shot;
        }
        else {
            awayScore += gameEvent.shot;
        }

        // Depending on miss or make, 
        // Award rebound or assist to player recorded.
        if (gameEvent.shot === Shot.MISS) {
            defenseTeamRows[findRowIndexForPlayer(defenseTeamRows, gameEvent.rebound!.playerId)].rebounds += 1;
        }
        else {
            offenseTeamRows[findRowIndexForPlayer(offenseTeamRows, gameEvent.assist!.playerId)].assists += 1;
        }
    }

    // Winning team is the team with the highest score.
    const winningTeam: string = homeScore > awayScore
        ? match.homeTeam :
        match.awayTeam;
    // Populate archivedMatch values to new object
    const newArchivedMatch: archivedMatch = {
        ...match,
        outcome: {
            winner: winningTeam,
            home: {
                score: homeScore
            },
            away: {
                score: awayScore
            }
        },
        boxScore: boxScore,
        finishedAt: dateNow
    }

    // Return archivedMatch
    return newArchivedMatch;

};

/**
 * Internal use only.
 * Used for populating Rows with given Team.
 * 
 * @param team team to populate row.
 * @returns Default rows for a given team.
 */
const calculateRows = (team: Team): Row[] => {
    let players: Player[] = [team.pointGuard!, team.shootingGuard!, team.smallForward!, team.powerForward!, team.centre!];
    let rowArray: Row[] = [];

    for (let i = 0; i <= 4; i++) {
        let player = players[i];
        rowArray[i] = {
            playerId: player.id,
            playerName: player.name,
            points: 0,
            assists: 0,
            rebounds: 0
        }
    }

    return rowArray;
}

/**
 * Internal use only.
 * Finds a player from a given row,
 * returns index
 * 
 * @param rows rows to go through
 * @param playerId player id to find
 * @returns index of player in array.
 */
const findRowIndexForPlayer = (rows: Row[], playerId: string): number => {
    let index: number = -1;
    for (let row of rows) {
        if (row.playerId == playerId) {
            index = rows.indexOf(row);
            break;
        }
    }
    return index;
}