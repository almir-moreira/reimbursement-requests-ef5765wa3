-- Fix requests RLS to allow requester_id to view and update their requests
DROP POLICY IF EXISTS "Users can read requests" ON public.requests;
CREATE POLICY "Users can read requests" ON public.requests
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR requester_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk'])
  )
  OR EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN (
      SELECT cost_centers."coEmail" FROM cost_centers WHERE cost_centers.id = requests.cost_center_id OR cost_centers.code = (requests.data->>'costCenter') OR cost_centers.name = (requests.data->>'costCenter')
    )
  )
);

DROP POLICY IF EXISTS "Users can update requests" ON public.requests;
CREATE POLICY "Users can update requests" ON public.requests
FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() 
  OR requester_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk'])
  )
  OR EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN (
      SELECT cost_centers."coEmail" FROM cost_centers WHERE cost_centers.id = requests.cost_center_id OR cost_centers.code = (requests.data->>'costCenter') OR cost_centers.name = (requests.data->>'costCenter')
    )
  )
);

-- Fix view to fallback to user_id if requester_id is null
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
LEFT JOIN public.profiles p ON COALESCE(r.requester_id, r.user_id) = p.id
LEFT JOIN public.events e ON r.event_id = e.id
LEFT JOIN public.cost_centers c ON r.cost_center_id = c.id;
