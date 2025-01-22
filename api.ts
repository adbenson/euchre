
type Method = "GET" | "POST" | "PUT" | "DELETE";

type Endpoint = (request) => response;

interface Endpoint<RequestType, ResponseType extends Record<number, any>> {
    method: Method;
    path: string;
    request: RequestType,
    response: ResponseType,
}

interface Game {
    code: string;
}

interface startGame extends Endpoint<null, {200: Game}> {
    method: "POST",
    path: '/game',
};

const startGame: Endpoint<null, {200: Game}> = {
    method: "POST",
    path: "/game",
};

const getGame: Endpoint<null, {200: Game}> = {
    method: "GET",
    path: "/game",
}

const 
