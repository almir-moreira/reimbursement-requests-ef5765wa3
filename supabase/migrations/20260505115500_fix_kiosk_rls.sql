-- Ensure kiosk has explicitly granted RLS policies for requests
DO $$
BEGIN
  -- Fix INSERT policy
  DROP POLICY IF EXISTS "Users can insert own requests" ON public.requests;
  CREATE POLICY "Users can insert own requests" ON public.requests FOR INSERT TO authenticated
    WITH CHECK (
      (user_id = auth.uid()) OR
      (EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'co', 'finance', 'kiosk']) ))
    );

  -- Fix SELECT policy
  DROP POLICY IF EXISTS "Users can read requests" ON public.requests;
  CREATE POLICY "Users can read requests" ON public.requests FOR SELECT TO authenticated
    USING (
      (user_id = auth.uid()) OR
      (EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk']) )) OR
      (EXISTS ( SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN ( SELECT cost_centers."coEmail" FROM public.cost_centers WHERE cost_centers.code = (requests.data ->> 'costCenter') OR cost_centers.name = (requests.data ->> 'costCenter') ) ))
    );

  -- Fix UPDATE policy
  DROP POLICY IF EXISTS "Users can update requests" ON public.requests;
  CREATE POLICY "Users can update requests" ON public.requests FOR UPDATE TO authenticated
    USING (
      (user_id = auth.uid()) OR
      (EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk']) )) OR
      (EXISTS ( SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN ( SELECT cost_centers."coEmail" FROM public.cost_centers WHERE cost_centers.code = (requests.data ->> 'costCenter') OR cost_centers.name = (requests.data ->> 'costCenter') ) ))
    );
END $$;
