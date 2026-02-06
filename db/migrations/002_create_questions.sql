CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  text VARCHAR(500) NOT NULL,
  choices JSONB NOT NULL,
  correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 3)
);

CREATE INDEX idx_questions_category ON questions (category);
