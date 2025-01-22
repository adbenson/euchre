import { Card, Cards, CardSuit } from "./card-models";

export enum Team {
	A = "A",
	B = "B",
}

export interface Person {
	readonly firstName: string;
	readonly lastName: string;
}

export interface Player extends Person {
	readonly index: number;
	readonly team: Team;
}

export interface PlayerAction {
	readonly player: number;
	readonly card: Card;
}

export type Trick = ReadonlyArray<PlayerAction>;

export interface Scores {
	readonly [Team.A]: number;
	readonly [Team.B]: number;
}

export enum GamePhase {
	INTRO = "INTRO", // Show the user the introduction text
	DEAL = "DEAL", // Distribute deck to players and kitty
	BID1 = "BID1", // Players may order up card to dealer
	BID2 = "BID2", // Players may choose best,
	DEALER_DISCARD = "DEALER_DISCARD",
	PLAY_HAND = "PLAY_HAND", // Players choose a card to play until none remain
	SCORE_ROUND = "SCORE_ROUND",
	SCORE_HAND = "SCORE_HAND", // Score hand, if score >= 10 then end
	END = "END", // Final state
}

export const initialTableState = {
	upCard: undefined,
	kitty: [],
	hands: [],
	plays: [],
	tricks: [[], [], [], []],
}

/**
 * The "Table" contains all extant cards
 */
export interface TableState {
	readonly upCard?: Card;
	readonly kitty: Cards;
	readonly hands: ReadonlyArray<Cards>;
	readonly plays: ReadonlyArray<PlayerAction>;
	readonly tricks: ReadonlyArray<ReadonlyArray<Trick>>;
}

export interface GameState {
	readonly phase: GamePhase;

	readonly players: ReadonlyArray<Player>;
	readonly dealer: number;

	readonly table: TableState;
	readonly currentPlayer: number;

	readonly best?: CardSuit;
	readonly maker?: number;

	/**
	 * Player who starts the trick
	 * At the start of the hand, it's the player left of dealer
	 * After that, it's the player who won the previous trick
	 * 
	 * Counted 
	 */
	readonly startPlayer?: number;

	readonly scores: Scores;
}

export const initialScores: Scores = {
	[Team.A]: 0,
	[Team.B]: 0,
};

export const emptyHands: ReadonlyArray<Cards> = [
	[], [], [], []
];

export const initialState: GameState = {
	phase: GamePhase.INTRO,
	players: [],
	dealer: 0,
	currentPlayer: 0,
	scores: initialScores,
	table: initialTableState,
};
