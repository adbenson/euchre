# API

## Endpoints

### Start Game
* POST /game
* Request: null
* Response:
    * 201: GameState

### Get Game
* GET /game/:code
* Request: null
* Response:
    * 200: GameState
    * 404: GameNotFound

### Add Player
* POST /game/:code/add-player
* Request: AddPlayerRequest
* Response:
    * 200: GameState
    * 400: BadRequest
    * 404: GameNotFound
    * 409: GameFull

### Resume Player
* POST /game/:code/resume-player
* Request: ResumePlayerRequest
* Response:
    * 200: GameState
    * 400: BadRequest
    * 403: InvalidResumeToken
    * 404: GameNotFound

### Player Action
* POST /game/:code/action
* Request: PlayerActionRequest
* Response:
    * 200: GameState
    * 400: BadRequest
    * 403: InvalidActionToken
    * 404: GameNotFound

###

## Models

### CardCode
```ts
// First Letter of Suit + rank (number or J = Jack, Q = Queen, K = King, A = Ace, ? = Joker)
"S2" | "S3" | "S4" ... "SJ" | "SQ" | "SK" | "SA" | "S?" | "D2" | "D3" ...
```

### PlayerActionRequest
```ts
{
    nonce: string;
    action: CardCode;
}
```

### AddPlayerRequest
```ts
{
    name: string;
}
```

### ResumePlayerRequest
```ts
{
    token: string;
}
```

### Team
```ts
"A" | "B"
```

### Players
```ts
{
    name: string;
    number: number;
    team: Team;
}
```

### GamePhase
```ts
	"INTRO" | "DEAL" | "BID1" | "BID2" | "DEALER_DISCARD" |
	"PLAY_HAND" | "SCORE_ROUND" | "SCORE_HAND" | "END"
```

### GameState
```ts
{
    code: string;
    state: GamePhase
    players: Array<Player>
}
```