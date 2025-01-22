import { shuffle } from "../array-utils";
import { newCard, CardFace, Cards, CardSuit, codeToCard, Card } from "./card-models";
import { addScores, cardScore, deal, deck, handOver, isLeftBower, isRightBower, isBestCard, leftOfPlayer, rightOfPlayer, scoreHand, sortCards, winningPlayer } from "./game-rules";
import { PlayerAction, Team, Trick } from "./game-state";

function tricks(...wins: Array<number>): Array<Array<Trick>> {
	return wins.map(w => Array(w));
}

function codesToCards(codes: Array<string>): Cards {
	return codes.map(code => codeToCard(code));
}

describe("game rules", () => {
	// describe("gameOver", () => {
	// 	it("identifies team A win", () => {
	// 		expect(gameOver({
	// 			[Team.A]: 10,
	// 			[Team.B]: 9,
	// 		})).toBeTruthy();
	// 	});
	// 	it("identifies team B win", () => {
	// 		expect(gameOver({
	// 			[Team.A]: 7,
	// 			[Team.B]: 11,
	// 		})).toBeTruthy();
	// 	});
	// 	it("identifies neither win", () => {
	// 		expect(gameOver({
	// 			[Team.A]: 9,
	// 			[Team.B]: 9,
	// 		})).toBeFalsy();
	// 	});
	// });
	describe("addScores", () => {
		const a = {
			[Team.A]: 44,
			[Team.B]: 13,
		};
		const b = {
			[Team.A]: 16,
			[Team.B]: 108,
		};
		it("sums scores", () => {
			const result = addScores(a, b);
			expect(result[Team.A]).toEqual(60);
			expect(result[Team.B]).toEqual(121);
		});
		it("returns new object", () => {
			const result = addScores(a, b);
			expect(result).not.toBe(a);
			expect(result).not.toBe(b);
		});
	});
	describe("scoreHand", () => {
		it("Scores team A win", () => {
			const result = scoreHand(tricks(3, 2, 0, 0), 0);
			expect(result[Team.A]).toEqual(1);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team B win", () => {
			const result = scoreHand(tricks(1, 2, 0, 2), 3);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(1);
		});
		it("Scores team A euchre", () => {
			const result = scoreHand(tricks(1, 1, 1, 2), 2);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(2);
		});
		it("Scores team B euchre", () => {
			const result = scoreHand(tricks(0, 0, 4, 1), 1);
			expect(result[Team.A]).toEqual(2);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team A sweep", () => {
			const result = scoreHand(tricks(2, 0, 3, 0), 2);
			expect(result[Team.A]).toEqual(2);
			expect(result[Team.B]).toEqual(0);
		});
		it("Scores team B sweep", () => {
			const result = scoreHand(tricks(0, 5, 0, 0), 1);
			expect(result[Team.A]).toEqual(0);
			expect(result[Team.B]).toEqual(2);
		});
	});
	describe("rightOfPlayer", () => {
		it("decrements player index", () => {
			expect(rightOfPlayer(2)).toBe(1);
		});
		it("wraps around at 0", () => {
			expect(rightOfPlayer(0)).toBe(3);
		});
	});
	describe("leftOfPlayer", () => {
		it("increments player index", () => {
			expect(leftOfPlayer(1)).toBe(2);
		});
		it("wraps around at 3", () => {
			expect(leftOfPlayer(3)).toBe(0);
		});
	});
	describe("deal", () => {
		// We're not going to test the full order of deal because, frankly, it doesn't matter.
		it("deals every card", () => {
			const table = deal(shuffle(deck), 0);
			const all = [
				...table.hands[0],
				...table.hands[1],
				...table.hands[2],
				...table.hands[3],
				table.upCard,
				...table.kitty,
			];

			expect(all.length).toEqual(deck.length);
		});
		it("deals every card exactly once", () => {
			const table = deal(shuffle(deck), 0);
			const all = [
				...table.hands[0],
				...table.hands[1],
				...table.hands[2],
				...table.hands[3],
				table.upCard,
				...table.kitty,
			] as Cards;

			const strings = all.map(card => card?.suit + card.rank);

			strings.sort();

			// Any duplicate cards should sort adjacent
			for (let i = 1; i < strings.length; i++) {
				expect(strings[i]).not.toEqual(strings[i - 1]);
			}
		});
	});
	describe("cards", () => {
		it("creates a deck of 24 cards", () => {
			expect(deck.length).toEqual(24);
		});
		it("creates no duplicates", () => {
			const strings = deck.map(card => card?.suit + card.rank);

			strings.sort();

			// Any duplicate cards should sort adjacent
			for (let i = 1; i < strings.length; i++) {
				expect(strings[i]).not.toEqual(strings[i - 1]);
			}
		});
	});
	describe("isBestCard", () => {
		it("identifies best card", () => {
			expect(isBestCard(newCard(CardSuit.SPADES, 6), CardSuit.SPADES)).toBeTruthy();
		});
		it("identifies left bower", () => {
			expect(isBestCard(newCard(CardSuit.SPADES, CardFace.JACK), CardSuit.CLUBS)).toBeTruthy();
		});
		it("rejects non-best jack", () => {
			expect(isBestCard(newCard(CardSuit.CLUBS, CardFace.JACK), CardSuit.DIAMONDS)).toBeFalsy();
		});
	});
	describe("isRightBower", () => {
		it("identifies right bower", () => {
			expect(isRightBower(newCard(CardSuit.SPADES, CardFace.JACK), CardSuit.SPADES)).toBeTruthy();
		});
		it("rejects left bower", () => {
			expect(isRightBower(newCard(CardSuit.SPADES, CardFace.JACK), CardSuit.CLUBS)).toBeFalsy();
		});
		it("rejects non bower", () => {
			expect(isRightBower(newCard(CardSuit.HEARTS, CardFace.ACE), CardSuit.HEARTS)).toBeFalsy();
		});
	});
	describe("isLeftBower", () => {
		it("identifies left bower of Spades", () => {
			expect(isLeftBower(newCard(CardSuit.CLUBS, CardFace.JACK), CardSuit.SPADES)).toBeTruthy();
		});
		it("identifies left bower of Diamonds", () => {
			expect(isLeftBower(newCard(CardSuit.HEARTS, CardFace.JACK), CardSuit.DIAMONDS)).toBeTruthy();
		});
		it("identifies left bower of Clubs", () => {
			expect(isLeftBower(newCard(CardSuit.SPADES, CardFace.JACK), CardSuit.CLUBS)).toBeTruthy();
		});
		it("identifies left bower of Hearts", () => {
			expect(isLeftBower(newCard(CardSuit.DIAMONDS, CardFace.JACK), CardSuit.HEARTS)).toBeTruthy();
		});
		it("rejects right bower", () => {
			expect(isLeftBower(newCard(CardSuit.DIAMONDS, CardFace.JACK), CardSuit.DIAMONDS)).toBeFalsy();
		});
		it("rejects non bower", () => {
			expect(isLeftBower(newCard(CardSuit.CLUBS, CardFace.ACE), CardSuit.CLUBS)).toBeFalsy();
		});
	});
	describe("sortCards", () => {
		it("sorts same suit no best no lead", () => {
			const cards = codesToCards(["H2", "H3", "H10", "HJ", "HQ", "HK", "HA"]);
			const sorted = sortCards(shuffle(cards));
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same suit not best no lead", () => {
			const cards = codesToCards(["H2", "H3", "H10", "HJ", "HQ", "HK", "HA"]);
			const sorted = sortCards(shuffle(cards), CardSuit.SPADES);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same suit not best not lead", () => {
			const cards = codesToCards(["H2", "H3", "H10", "HJ", "HQ", "HK", "HA"]);
			const sorted = sortCards(shuffle(cards), CardSuit.SPADES, CardSuit.CLUBS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same suit best no lead", () => {
			const cards = codesToCards(["H2", "H3", "H10", "HQ", "HK", "HA", "DJ", "HJ"]);
			const sorted = sortCards(shuffle(cards), CardSuit.HEARTS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same suit best and lead", () => {
			const cards = codesToCards(["H2", "H3", "H10", "HQ", "HK", "HA", "DJ", "HJ"]);
			const sorted = sortCards(shuffle(cards), CardSuit.HEARTS, CardSuit.HEARTS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same card in four suits no best no lead", () => {
			const cards = codesToCards(["HA", "CA", "DA", "SA"]);
			const sorted = sortCards(shuffle(cards));
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same card in four suits with best no lead", () => {
			const cards = codesToCards(["HA", "DA", "SA", "CA"]);
			const sorted = sortCards(shuffle(cards), CardSuit.CLUBS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same card in four suits with best with lead", () => {
			const cards = codesToCards(["DA", "SA", "HA", "CA"]);
			const sorted = sortCards(shuffle(cards), CardSuit.CLUBS, CardSuit.HEARTS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts same card in four suits with best with lead", () => {
			const cards = codesToCards(["DA", "SA", "HA", "CA"]);
			const sorted = sortCards(shuffle(cards), CardSuit.CLUBS, CardSuit.HEARTS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts mix of best and next cards no lead", () => {
			const cards = codesToCards(["S10", "SQ", "SK", "SA", "C9", "CQ", "CA", "SJ", "CJ"]);
			const sorted = sortCards(shuffle(cards), CardSuit.CLUBS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts mix of best and next cards with next led", () => {
			const cards = codesToCards(["S10", "SQ", "SK", "SA", "C9", "CQ", "CA", "SJ", "CJ"]);
			const sorted = sortCards(shuffle(cards), CardSuit.CLUBS, CardSuit.SPADES);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
		it("sorts highest and lowest cards in each suit", () => {
			const cards = codesToCards(["C9", "CA", "S9", "SA", "D9", "DA", "H9", "HA", "DJ", "HJ"]);
			const sorted = sortCards(shuffle(cards), CardSuit.HEARTS, CardSuit.DIAMONDS);
			expect(sorted.map(c => c.code)).toEqual(cards.map(c => c.code));
		});
	});
	describe("cardScore", () => {
		// it("scores non-best non-lead number card", () => {
		// 	const score = cardScore(newCard(CardSuit.SPADES, 9), CardSuit.CLUBS, CardSuit.HEARTS);

		// 	expect(score).toEqual(card.rank);
		// });
		// it("scores non-best lead number card", () => {
		// 	const card = newCard(CardSuit.SPADES, 8);

		// 	const score = cardScore(card, CardSuit.CLUBS, CardSuit.SPADES);

		// 	expect(score).toEqual(card.rank as number + 100);
		// });
		// it("scores best lead number card", () => {
		// 	const card = newCard(CardSuit.SPADES, 7);

		// 	const score = cardScore(card, CardSuit.SPADES, CardSuit.SPADES);

		// 	expect(score).toEqual(card.rank as number + 100 + 1000);
		// });
		// it("scores best non-lead number card", () => {
		// 	const card = newCard(CardSuit.SPADES, 6);

		// 	const score = cardScore(card, CardSuit.SPADES, CardSuit.CLUBS);

		// 	expect(score).toEqual(card.rank as number + 1000);
		// });
		// it("scores non-best non-lead face card", () => {
		// 	const card = newCard(CardSuit.SPADES, CardFace.QUEEN);

		// 	const score = cardScore(card, CardSuit.CLUBS, CardSuit.HEARTS);

		// 	expect(score).toEqual(12);
		// });
		// it("scores non-best lead face card", () => {
		// 	const card = newCard(CardSuit.HEARTS, CardFace.KING);

		// 	const score = cardScore(card, CardSuit.CLUBS, CardSuit.HEARTS);

		// 	expect(score).toEqual(13 + 100);
		// });
		// it("scores best lead face card", () => {
		// 	const card = newCard(CardSuit.CLUBS, CardFace.ACE);

		// 	const score = cardScore(card, CardSuit.CLUBS, CardSuit.CLUBS);

		// 	expect(score).toEqual(13 + 100 + 1000);
		// });
		// it("scores best non-lead face card", () => {
		// 	const card = newCard(CardSuit.DIAMONDS, CardFace.QUEEN);

		// 	const score = cardScore(card, CardSuit.DIAMONDS, CardSuit.SPADES);

		// 	expect(score).toEqual(11 + 1000);
		// });
		// it("scores left bower", () => {
		// 	const card = newCard(CardSuit.HEARTS, CardFace.JACK);

		// 	const score = cardScore(card, CardSuit.DIAMONDS, CardSuit.SPADES);

		// 	expect(score).toEqual(14 + 1000);
		// });
		// it("scores right bower", () => {
		// 	const card = newCard(CardSuit.CLUBS, CardFace.JACK);

		// 	const score = cardScore(card, CardSuit.CLUBS, CardSuit.SPADES);

		// 	expect(score).toEqual(15 + 1000);
		// });
	});
	describe("winningPlayer", () => {
		it("right bower wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.CLUBS, CardFace.JACK),},
				{player: 3, card: newCard(CardSuit.HEARTS, CardFace.JACK),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.JACK),},
				{player: 1, card: newCard(CardSuit.SPADES, CardFace.JACK),},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(0);
		});
		it("left bower wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.CLUBS, CardFace.JACK),},
				{player: 3, card: newCard(CardSuit.HEARTS, CardFace.JACK),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
				{player: 1, card: newCard(CardSuit.SPADES, CardFace.JACK),},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(3);
		});
		it("Low best wins", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.CLUBS, CardFace.ACE),},
				{player: 3, card: newCard(CardSuit.HEARTS, CardFace.ACE),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
				{player: 1, card: newCard(CardSuit.SPADES, 9),},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(1);
		});
		it("Low lead wins (no best)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.CLUBS, 9),},
				{player: 3, card: newCard(CardSuit.HEARTS, CardFace.ACE),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
				{player: 1, card: newCard(CardSuit.DIAMONDS, CardFace.KING),},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(2);
		});
		it("Second-lowest lead wins (no best)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.CLUBS, 9),},
				{player: 3, card: newCard(CardSuit.HEARTS, CardFace.ACE),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
				{player: 1, card: newCard(CardSuit.CLUBS, 10),},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(1);
		});
		it("Lead ace wins (no best)", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 2, card: newCard(CardSuit.DIAMONDS, 9),},
				{player: 3, card: newCard(CardSuit.DIAMONDS, CardFace.KING),},
				{player: 0, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
				{player: 1, card: newCard(CardSuit.DIAMONDS, CardFace.QUEEN),},
			];

			const winner = winningPlayer(plays, CardSuit.SPADES);

			expect(winner).toBe(0);
		});
		it("Right bower wins against Left bower lead", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 0, card: newCard(CardSuit.HEARTS, CardFace.JACK),},
				{player: 1, card: newCard(CardSuit.CLUBS, CardFace.JACK),},
				{player: 2, card: newCard(CardSuit.DIAMONDS, 9),},
				{player: 3, card: newCard(CardSuit.DIAMONDS, CardFace.JACK),},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(3);
		});
		it("Left bower lead wins against best Ace", () => {
			const plays: ReadonlyArray<PlayerAction> = [
				{player: 0, card: newCard(CardSuit.HEARTS, CardFace.JACK),},
				{player: 1, card: newCard(CardSuit.CLUBS, CardFace.JACK),},
				{player: 2, card: newCard(CardSuit.DIAMONDS, 9),},
				{player: 3, card: newCard(CardSuit.DIAMONDS, CardFace.ACE),},
			];

			const winner = winningPlayer(plays, CardSuit.DIAMONDS);

			expect(winner).toBe(0);
		});
	});
	describe("handOver", () => {
		it("returns false if no tricks taken", () => {
			expect(handOver(tricks(0, 0, 0, 0))).toBeFalsy();
		});
		it("returns true if 5 tricks taken by single player", () => {
			expect(handOver(tricks(0, 5, 0, 0))).toBeTruthy();
		});
		it("returns false if one taken by each player", () => {
			expect(handOver(tricks(1, 1, 1, 1))).toBeFalsy();
		});
		it("returns true if five tricks taken total", () => {
			expect(handOver(tricks(1, 2, 2, 0))).toBeTruthy();
		});
	});
});
