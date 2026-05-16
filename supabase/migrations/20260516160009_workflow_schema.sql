-- Add standard snake_case foreign keys to requests
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS requester_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS event_id TEXT REFERENCES public.events(id),
ADD COLUMN IF NOT EXISTS cost_center_id TEXT REFERENCES public.cost_centers(id);

-- Backfill requester_id with existing user_id if any exists
UPDATE public.requests SET requester_id = user_id WHERE requester_id IS NULL;

-- Create workflow_events table
CREATE TABLE IF NOT EXISTS public.workflow_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status_from TEXT,
    status_to TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    comments TEXT,
    processed BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.workflow_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.workflow_events;
CREATE POLICY "Enable read access for all authenticated users" ON public.workflow_events
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.workflow_events;
CREATE POLICY "Enable insert for authenticated users" ON public.workflow_events
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create Context View for Webhooks
CREATE OR REPLACE VIEW public.v_request_workflow_context AS
SELECT 
    r.id as request_id,
    r.status as current_status,
    r.created_at as request_created_at,
    r.user_id as legacy_user_id,
    r.requester_id,
    p.email as requester_email,
    p.name as requester_name,
    r.event_id,
    e.name as event_name,
    r.cost_center_id,
    c.code as cost_center_code,
    c."coEmail" as co_email,
    c."coName" as co_name,
    r.data
FROM public.requests r
LEFT JOIN public.profiles p ON r.requester_id = p.id
LEFT JOIN public.events e ON r.event_id = e.id
LEFT JOIN public.cost_centers c ON r.cost_center_id = c.id;
