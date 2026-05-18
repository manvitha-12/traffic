
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hour INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL DEFAULT 0,
  temperature NUMERIC NOT NULL,
  rain INTEGER NOT NULL DEFAULT 0,
  holiday INTEGER NOT NULL DEFAULT 0,
  junction INTEGER NOT NULL DEFAULT 1,
  vehicles INTEGER NOT NULL,
  nearby_events INTEGER NOT NULL DEFAULT 0,
  prediction TEXT NOT NULL,
  confidence NUMERIC NOT NULL DEFAULT 0,
  prob_low NUMERIC NOT NULL DEFAULT 0,
  prob_medium NUMERIC NOT NULL DEFAULT 0,
  prob_high NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view predictions"
  ON public.predictions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);
