# Drew's Euchre

This app demonstrates proficiency with React and Redux as well as general modern web development principles, technologies, and best practices.

[Try the deployed application](http://adbenson.net/portfolio/euchre)

If you're unfamiliar with the game of Euchre, Wikipedia has a [detailed explanation](https://en.wikipedia.org/wiki/Euchre).
Since this website is created as a portfolio demo, you don't need to know the game well so included below is a [condensed description](#Euchre) of the game.

This web app is a demonstration only: since no one can hide their cards play would be pointless.
That said, this implementation is complete and accurate with thorough rules for card ranking and scoring.

## Features

- Created using React for components and Redux for state management.
- Code is written entirely in TypeScript with JSX with yarn for dependency management, and tests are written using jasmine.
- Highly functional programming with totally immutable state
- Unit tests for all game rules
- Integration with randomuser.me API for player names
- Cards are dealt in the traditional manner (3-2-3-2-2-3-2-3) (this doesn't matter with a random shuffle but it was important to me.)
- Cards in the kitty and completed tricks are shown using a "mini card" with just rank and suit to save space.
- Cards automatically sort by trump, then traditional suit order, then rank including left and right bowers.
- Pleasing animated transitions on hover over valid cards.
- Player hands are displayd with cards splayed and overlapping, much as they would be in actual play.
- Automatic scoring at the end of each round with consideration for who ordered up trump and being euchred.
- Score cards displayed in the traditional format, with 4s and 6s overlapping so the number of pips showing indicates the team's score.
- Flashy post-game card waterfall with pseudo-3D rotation effect accomplished entirely through CSS.
- Fast-forward button (lower right corner) to automatically make next play to simplify demonstration.

## Euchre

Euchre is a trick-taking card game with two teams of two players each.
Each player is dealt a "hand" of 5 cards and given the chance to declare which suit will be "trump" and beat all other suits.
Players then each play a card and the highest-ranking card played wins that "trick".
The team with the most tricks earns a point, and the first team to 10 points wins!
But there's a catch: if your team chose the trump suit and didn't win the most tricks,
then you've been "euchred" and your opponents get two points!

Euchre is around 200 years old and popular in the American midwest and around the world.
