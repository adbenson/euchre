CREATE TABLE IF NOT EXISTS TEAMS (name character(1) NOT NULL, PRIMARY KEY (name));

TRUNCATE TABLE teams;

INSERT INTO
  teams (name)
VALUES
  ('A'),
  ('B');

CREATE TABLE IF NOT EXISTS suits (name character(8) NOT NULL, PRIMARY KEY (name));

TRUNCATE TABLE suits;

INSERT INTO
  suits (name)
VALUES
  ('SPADES'),
  ('DIAMONDS'),
  ('CLUBS'),
  ('HEARTS');

CREATE TABLE IF NOT EXISTS game_phases (name character(15) NOT NULL, PRIMARY KEY (name));

TRUNCATE TABLE game_phases;

INSERT INTO
  game_phases (name)
VALUES
  ('START'),
  ('DEAL'),
  ('BID1'),
  ('BID2'),
  ('DEALER_DISCARD'),
  ('PLAY_HAND'),
  ('SCORE_ROUND'),
  ('SCORE_HAND'),
  ('END');

CREATE TABLE IF NOT EXISTS cards (code character(3) NOT NULL, PRIMARY KEY (code));

TRUNCATE TABLE cards;

INSERT INTO
  cards (code)
VALUES
  ('S2'),
  ('S3'),
  ('S4'),
  ('S5'),
  ('S6'),
  ('S7'),
  ('S8'),
  ('S9'),
  ('S10'),
  ('SJ'),
  ('SQ'),
  ('SK'),
  ('SA'),
  ('D2'),
  ('D3'),
  ('D4'),
  ('D5'),
  ('D6'),
  ('D7'),
  ('D8'),
  ('D9'),
  ('D10'),
  ('DJ'),
  ('DQ'),
  ('DK'),
  ('DA'),
  ('C2'),
  ('C3'),
  ('C4'),
  ('C5'),
  ('C6'),
  ('C7'),
  ('C8'),
  ('C9'),
  ('C10'),
  ('CJ'),
  ('CQ'),
  ('CK'),
  ('CA'),
  ('H2'),
  ('H3'),
  ('H4'),
  ('H5'),
  ('H6'),
  ('H7'),
  ('H8'),
  ('H9'),
  ('H10'),
  ('HJ'),
  ('HQ'),
  ('HK'),
  ('HA');

CREATE TABLE IF NOT EXISTS players (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  position smallint NOT NULL,
  team_name character(1) NOT NULL,
  name character varying(255) NOT NULL,
  token character varying(255) NOT NULL UNIQUE,
  PRIMARY KEY (id),
  FOREIGN KEY (team_name) REFERENCES teams (name)
);

CREATE TABLE IF NOT EXISTS games (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  created timestamp without time zone NOT NULL,
  modified timestamp without time zone NOT NULL,
  code character(5) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game_players (
  game_id integer NOT NULL,
  player_id integer NOT NULL,
  PRIMARY KEY (player_id, game_id),
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (player_id) REFERENCES players (id)
);

CREATE TABLE IF NOT EXISTS game_state (
  game_id integer NOT NULL,
  phase character(15) NOT NULL,
  score_team_a smallint NOT NULL DEFAULT 0,
  score_team_b smallint NOT NULL DEFAULT 0,
  best character(8),
  up_card_code character(3),
  dealer_player_id integer NOT NULL DEFAULT 0,
  current_player_id integer NOT NULL DEFAULT 0,
  maker_player_id integer,
  PRIMARY KEY (game_id),
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (phase) REFERENCES game_phases (name),
  FOREIGN KEY (best) REFERENCES suits (name),
  FOREIGN KEY (up_card_code) REFERENCES cards (code),
  FOREIGN KEY (dealer_player_id) REFERENCES players (id),
  FOREIGN KEY (current_player_id) REFERENCES players (id),
  FOREIGN KEY (maker_player_id) REFERENCES players (id)
);

CREATE TABLE IF NOT EXISTS kitty (
  game_id integer NOT NULL,
  card_code character(3) NOT NULL,
  PRIMARY KEY (game_id, card_code),
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (card_code) REFERENCES cards (code)
);

CREATE TABLE IF NOT EXISTS player_hands (
  player_id integer NOT NULL,
  card_code character(3) NOT NULL,
  PRIMARY KEY (player_id, card_code),
  FOREIGN KEY (player_id) REFERENCES players (id),
  FOREIGN KEY (card_code) REFERENCES cards (code)
);

CREATE TABLE IF NOT EXISTS trick_cards (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  card_code character(3) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (card_code) REFERENCES cards (code)
);

CREATE TABLE IF NOT EXISTS player_plays (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  player_id integer NOT NULL,
  card_code character(3) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (player_id) REFERENCES players (id),
  FOREIGN KEY (card_code) REFERENCES cards (code)
);

CREATE TABLE IF NOT EXISTS player_tricks (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  player_id integer NOT NULL,
  trick_id integer NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (player_id) REFERENCES players (id),
  FOREIGN KEY (trick_id) REFERENCES trick_cards (id)
);

CREATE TABLE IF NOT EXISTS nonces (
  game_id integer NOT NULL,
  player_id integer NOT NULL,
  nonce character varying(255) NOT NULL UNIQUE,
  PRIMARY KEY (game_id, player_id),
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (player_id) REFERENCES players (id)
);