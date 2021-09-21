import { Card as CardModel, Cards } from "../card-models";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface HandProps {
	cards: Cards,
	onCardClick: (card: CardModel) => void;
}

export function Hand(props: HandProps) {
	const cardClickHandler = (card: CardModel) => props.onCardClick(card);

	return (
		<div className={styles.hand}>
			{props.cards.map((card) =>
				<Card
					card={card}
					onClick={() => cardClickHandler(card)}
				></Card>
			)}
		</div>
	);
}