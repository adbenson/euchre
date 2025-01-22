import { useAppDispatch, useAppSelector } from "../app/hooks";
import { cardToImage, suitToImage } from "../game/card-models";
import { autoPlay } from "../game/game-slice";
import { GamePhase } from "../game/game-state";
import { CardParty } from "./CardParty";
import { MiniStack } from "./MiniStack";
import { PlayedCards } from "./PlayedCards";
import { Player } from "./Player";
import { Scores } from "./Scores";
import styles from "./Table.module.css";

export function Table() {
	const game = useAppSelector(state => state.game);
	const dispatch = useAppDispatch();

	const maker = (game.maker !== undefined) && game.players[game.maker].firstName;

	const showBest = game.best && (game.phase === GamePhase.PLAY_HAND);

	return (
		<div className={styles.table}>

			<div className={styles.topOfScreen}>
				<MiniStack cards={game.table.kitty}></MiniStack>

				{game.best && showBest ?
					<span className={styles.best}>
						{maker} ordered up
						<img alt={game.best} className={styles.bestSuit} src={suitToImage[game.best!]}></img>
					</span>
					: null
				}
			</div>

			<div className={styles.bottomOfScreen}>
				<Scores></Scores>
			</div>

			<div className={styles.centerField}>
				{game.table.upCard ? <img className={styles.upCard} alt="Up Card" src={cardToImage(game.table.upCard)}></img> : null}
				<PlayedCards></PlayedCards>
			</div>

			<div className={`${styles.player} ${styles.top} ${styles.left}`}>
				<Player playerIndex={0}></Player>
			</div>
			<div className={`${styles.player} ${styles.top} ${styles.right}`}>
				<Player playerIndex={1} tricksOnLeft={true}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.right}`}>
				<Player playerIndex={2} tricksOnLeft={true}></Player>
			</div>
			<div className={`${styles.player} ${styles.bottom} ${styles.left}`}>
				<Player playerIndex={3}></Player>
			</div>

			<button
				className={styles.fastForwardButton}
				onClick={() => dispatch(autoPlay())}
			>
				{">>"}
			</button>

			{game.phase === GamePhase.END ? <CardParty></CardParty> : null}
		</div>
	);
}
