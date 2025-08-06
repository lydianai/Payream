CREATE TABLE user_comparisons (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_ids TEXT[] NOT NULL,
  comparison_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_comparisons_user_id ON user_comparisons(user_id);
CREATE INDEX idx_user_comparisons_created_at ON user_comparisons(created_at);
