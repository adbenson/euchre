import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { RootState } from "../app/store";
import { shuffle } from "../array-utils";
import { Card, Cards, CardSuit, removeCard } from "./card-models";
import { deal as dealCards, deck as newDeck, leftOfPlayer, rightOfPlayer, randomPlayer, winningPlayer, scoreHand, addScores, winner, handOver } from "./game-rules";
import { GamePhase, GameState, initialState, initialTableState, Person, TableState, Team } from "./game-state";

export function addPlayersReducer(state: WritableDraft<GameState>, action: PayloadAction<Array<Person>>): void {
	if (action.payload.length !== 4) {
		throw new Error("Must supply exactly 4 players");
	}
	const players = action.payload;
	state.players = [
		{index: 0, ...players[0], team: Team.A},
		{index: 1, ...players[1], team: Team.B},
		{index: 2, ...players[2], team: Team.A},
		{index: 3, ...players[3], team: Team.B},
	];
	state.dealer = randomPlayer();
	state.phase = GamePhase.DEAL;
}

export function dealReducer(state: WritableDraft<GameState>): void {
	const deck = shuffle(newDeck);
	const table = dealCards(deck, state.dealer);
	state.table = table as WritableDraft<TableState>;
	state.startPlayer = leftOfPlayer(state.dealer)
	state.currentPlayer = state.startPlayer;
	state.phase = GamePhase.BID1;
}

export function passBidReducer(state: WritableDraft<GameState>): void {
	if (state.phase === GamePhase.BID1 && state.currentPlayer === state.dealer) {
		state.phase = GamePhase.BID2;
	}

	state.currentPlayer = leftOfPlayer(state.currentPlayer);
}

export function orderUpCardReducer(state: WritableDraft<GameState>): void {
	state.best = state.table.upCard!.suit;
	state.maker = state.currentPlayer;

	state.phase = GamePhase.DEALER_DISCARD;
}

export function callBestReducer(state: WritableDraft<GameState>, action: PayloadAction<CardSuit>): void {

	const suit = action.payload;
	// Validate that suit is not same as upcard
	state.best = suit;
	state.maker = state.currentPlayer;

	state.table.kitty.push(state.table.upCard!);
	state.table.upCard = undefined;

	startPlayReducer(state);
}

export function dealerDiscardAndPickupReducer(state: WritableDraft<GameState>, action: PayloadAction<Card>): void {
	if (!state.table) throw new Error("Table must be populated");

	const discard = action.payload;

	// Add upcard to dealer's hand
	const dealerHand = [...state.table.hands[state.dealer], state.table.upCard!];
	state.table.upCard = undefined;

	// Remove discard and add to the kitty
	state.table.hands[state.dealer] = removeCard(dealerHand, discard) as WritableDraft<Cards>;
	state.table.kitty.push(discard);

	startPlayReducer(state);
}

function startPlayReducer(state: WritableDraft<GameState>): void {
	state.currentPlayer = leftOfPlayer(state.dealer);
	state.startPlayer = state.currentPlayer;

	state.phase = GamePhase.PLAY_HAND;
}

export function playCardReducer(state: WritableDraft<GameState>, action: PayloadAction<Card>): void {
	const card = action.payload;

	// TODO: renege test?

	state.table.plays.push({
		player: state.currentPlayer,
		card,
	});
	
	state.table.hands[state.currentPlayer] = removeCard(state.table.hands[state.currentPlayer], card) as WritableDraft<Cards>;

	if (state.currentPlayer === rightOfPlayer(state.startPlayer!)) {
		scoreTrickReducer(state);
	} else {
		state.currentPlayer = leftOfPlayer(state.currentPlayer);
	}
}

function scoreTrickReducer(state: WritableDraft<GameState>): void {
	const winner = winningPlayer(state.table.plays, state.best!);

	state.table.tricks[winner].push(state.table.plays);
	state.table.plays = [];

	state.startPlayer = winner;
	state.currentPlayer = state.startPlayer;

	if (handOver(state.table.tricks)) {
		scoreHandReducer(state);
	}
}

function scoreHandReducer(state: WritableDraft<GameState>): void {
	// End of hand - score hand
	const scores = scoreHand(state.table.tricks, state.maker!);
	state.scores = addScores(state.scores, scores);

	state.phase = GamePhase.DEAL;

	if (winner(state.scores)) {
		endGameReducer(state);
	} else {
		state.dealer = leftOfPlayer(state.dealer);
	}
}

function endGameReducer(state: WritableDraft<GameState>): void {
	// Clear the board
	state.table = initialTableState;
	state.best = undefined;

	state.phase = GamePhase.END;
}

export function autoPlayReducer(state: WritableDraft<GameState>): void {
	if (state.phase === GamePhase.DEAL) {
		dealReducer(state);
	} else if (state.phase === GamePhase.BID1) {
		orderUpCardReducer(state);
	} else if (state.phase === GamePhase.BID2) {
		callBestReducer(state, {payload: CardSuit.SPADES, type: ''});
	} else if (state.phase === GamePhase.DEALER_DISCARD) {
		const card = state.table.hands[state.dealer][0];
		dealerDiscardAndPickupReducer(state, {payload: card, type: ''});
	}else if (state.phase === GamePhase.PLAY_HAND) {
		const card = state.table.hands[state.currentPlayer][0];
		playCardReducer(state, {payload: card, type: ''});
	}
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		addPlayers: addPlayersReducer,
		deal: dealReducer,
		passBid: passBidReducer,
		orderUpCard: orderUpCardReducer,
		callBest: callBestReducer,
		dealerDiscardAndPickup: dealerDiscardAndPickupReducer,
		playCard: playCardReducer,
		autoPlay: autoPlayReducer,
	}
});

export const { 
	addPlayers,
	deal,
	passBid,
	orderUpCard,
	callBest,
	dealerDiscardAndPickup,
	playCard,
	autoPlay,
} = gameSlice.actions;

export const selectPhase = (state: RootState) => state.game.phase;
export const selectTable = (state: RootState) => state.game.table;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayer = (i: number) => (state: RootState) => state.game.players[i];
export const selectPlayerHand = (i: number) => (state: RootState) => state.game.table?.hands[i];
export const selectIsDealer = (i: number) => (state: RootState) => state.game.dealer === i;
export const selectIsCurrentPlayer = (i: number) => (state: RootState) => state.game.currentPlayer === i;

export default gameSlice.reducer;
