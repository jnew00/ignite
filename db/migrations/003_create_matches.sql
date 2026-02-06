CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_1_id UUID NOT NULL REFERENCES players(id),
  player_2_id UUID NOT NULL REFERENCES players(id),
  winner_id UUID REFERENCES players(id),
  player_1_score INTEGER NOT NULL,
  player_2_score INTEGER NOT NULL,
  elo_delta INTEGER NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_played_at ON matches (played_at DESC);
