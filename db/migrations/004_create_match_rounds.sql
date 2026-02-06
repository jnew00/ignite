CREATE TABLE IF NOT EXISTS match_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  round_number INTEGER NOT NULL,
  winner_id UUID REFERENCES players(id),
  answer_time_ms INTEGER
);

CREATE INDEX idx_match_rounds_match_round ON match_rounds (match_id, round_number);
