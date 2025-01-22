import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card, CardSuit } from "../game/card-models";
import { callBest, deal, dealerDiscardAndPickup, orderUpCard, passBid, playCard } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { Hand } from "./Hand";
import styles from "./Player.module.css";
import { MiniStack } from "./MiniStack";
import { SuitButtons } from "./SuitButtons";

export interface PlayerProps {
	readonly playerIndex: number;
	readonly tricksOnLeft?: boolean;
}

export function Player(props: PlayerProps) {
	const pi = props.playerIndex;
	const game = useAppSelector(state => state.game);

	const phase = game.phase;
	const player = game.players[pi];
	const hand = game.table.hands[pi] || [];
	const tricks = game.table.tricks[pi] || [];

	const isDealer = game.dealer === pi;
	const isCurrent = game.currentPlayer === pi;

	const showDeal = phase === GamePhase.DEAL && isDealer;
	const showPassBid = isCurrent && (phase === GamePhase.BID1 || (!isDealer && phase === GamePhase.BID2));
	const showOrderUp = isCurrent && phase === GamePhase.BID1;
	const showCallBest = isCurrent && phase === GamePhase.BID2;

	const canPlayCard = isCurrent && phase === GamePhase.PLAY_HAND;
	const dealerDiscard = isDealer && phase === GamePhase.DEALER_DISCARD;

	const dispatch = useAppDispatch();

	const cardClickHandler = (card: Card) => {
		if (canPlayCard) {
			dispatch(playCard(card));
		}
		if (dealerDiscard) {
			dispatch(dealerDiscardAndPickup(card));
		}
	};

	const onSuitClickHandler = (suit: CardSuit) => dispatch(callBest(suit));

	const passBidButton = () =>
		<button onClick={() => dispatch(passBid())}>
			PASS
		</button>

	const orderUpButton = () => 
		<button onClick={() => dispatch(orderUpCard())}>
			{isDealer ? "PICK UP" : "ORDER UP"}
		</button>

	const callBestButtons = () =>
		<SuitButtons onSuitClick={onSuitClickHandler}></SuitButtons>

	const dealButton = () =>
		<button onClick={() => dispatch(deal())}>
			DEAL
		</button>

	const disabled = !(canPlayCard || dealerDiscard);

	return (
		<div className={styles.playerContainer + (props.tricksOnLeft ? ` ${styles.tricksOnLeft}` : '')}>
			<div className={styles.player}>
				<Hand
					cards={hand}
					disabled={disabled}
					onCardClick={cardClickHandler}
				></Hand>

				<div className={styles.playerLabel}>
					{isDealer ? <img className={styles.dealerIcon} alt="Dealer Icon" src="images/dealer_hand.png"></img> : null}
					<span className={styles.playerName}>{player.firstName} {player.lastName}</span>
				</div>

				<div className={styles.playerActions}>
					{showDeal ? dealButton() : null}
					{showPassBid ? passBidButton() : null}
					{showOrderUp ? orderUpButton() : null}
					{showCallBest ? callBestButtons() : null}
				</div>
			</div>

			<div className={styles.trickList}>
				{tricks.map((trick, i) => <MiniStack key={i} cards={trick.map(t => t.card)}></MiniStack>)}
			</div>
		</div>
	);
}
