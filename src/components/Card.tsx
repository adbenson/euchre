import { Card as CardModel, cardName } from '../card-models';

export interface CardProps {
	card: CardModel,
	onClick: () => void,
}

export function Card(props: CardProps) {

	return (
		<button
			onClick={props.onClick}
		>
			{cardName(props.card)}
		</button>
	);
}