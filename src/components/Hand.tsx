import { useAppSelector } from "../app/hooks";
import { Card as CardModel, Cards } from "../game/card-models";
import { sortCards } from "../game/game-rules";
import { Card } from "./Card";
import styles from './Hand.module.css';

export interface HandProps {
	readonly cards: Cards;
	readonly onCardClick?: (card: CardModel) => void;
	readonly disabled?: boolean;
	readonly disableCard?: Array<boolean>;
	readonly splay?: boolean;
}

const handPropDefaults: Required<HandProps> = {
	cards: [],
	onCardClick: () => {},
	disabled: false,
	disableCard: [],
	splay: true,
}

export function Hand(props: HandProps) {
	const p: Required<HandProps> = {...handPropDefaults, ...props};

	const interval = 1.0 / (p.cards.length - 1);

	const best = useAppSelector(state => state.game.best);
	const sorted = sortCards(p.cards, best);

	return (
		<div className={styles.hand}>
			{sorted.map((card, i) => {
				const disabled = p.disabled || p.disableCard[i];
				return (<Card
					key={card.suit + card.rank}
					card={card}
					place={i * interval}
					onClick={() => p.onCardClick(card)}
					disabled={disabled}
					grayedOut={disabled}
					splay={p.cards.length > 1 && p.splay}
				></Card>);
			})}
		</div>
	);
}
