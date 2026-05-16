DO $$
BEGIN
  -- Drop dependent views
  DROP VIEW IF EXISTS public.v_request_workflow_context;

  -- Rename columns in cost_centers
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cost_centers' AND column_name='coName') THEN
    ALTER TABLE public.cost_centers RENAME COLUMN "coName" TO co_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cost_centers' AND column_name='coEmail') THEN
    ALTER TABLE public.cost_centers RENAME COLUMN "coEmail" TO co_email;
  END IF;

  -- Rename columns in events
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='events' AND column_name='costCenter') THEN
    ALTER TABLE public.events RENAME COLUMN "costCenter" TO cost_center;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='events' AND column_name='qcName') THEN
    ALTER TABLE public.events RENAME COLUMN "qcName" TO qc_name;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='events' AND column_name='qcEmail') THEN
    ALTER TABLE public.events RENAME COLUMN "qcEmail" TO qc_email;
  END IF;

  -- Add columns to requests
  ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS payment_method text CHECK (payment_method IN ('Cash', 'Bank Transfer'));
  ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS qc_rejection_reason text;
  ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS co_rejection_reason text;
  ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

  -- Recreate view v_request_workflow_context
  CREATE OR REPLACE VIEW public.v_request_workflow_context AS
  SELECT 
    r.id AS request_id,
    r.status AS current_status,
    r.created_at AS request_created_at,
    r.user_id AS legacy_user_id,
    r.requester_id,
    p.email AS requester_email,
    p.name AS requester_name,
    r.event_id,
    e.name AS event_name,
    r.cost_center_id,
    cc.code AS cost_center_code,
    cc.co_email,
    cc.co_name,
    r.data
  FROM public.requests r
  LEFT JOIN public.profiles p ON r.requester_id = p.id
  LEFT JOIN public.events e ON r.event_id = e.id
  LEFT JOIN public.cost_centers cc ON r.cost_center_id = cc.id;

  -- Update RLS policies to use new column name `co_email` instead of `coEmail`
  DROP POLICY IF EXISTS "Users can read requests" ON public.requests;
  CREATE POLICY "Users can read requests" ON public.requests
    FOR SELECT TO authenticated
    USING (
      user_id = auth.uid() OR 
      requester_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk'])) OR 
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN (
        SELECT cost_centers.co_email FROM cost_centers WHERE cost_centers.id = requests.cost_center_id OR cost_centers.code = (requests.data->>'costCenter') OR cost_centers.name = (requests.data->>'costCenter')
      ))
    );

  DROP POLICY IF EXISTS "Users can update requests" ON public.requests;
  CREATE POLICY "Users can update requests" ON public.requests
    FOR UPDATE TO authenticated
    USING (
      user_id = auth.uid() OR 
      requester_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin', 'qc', 'finance', 'kiosk'])) OR 
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'co' AND p.email IN (
        SELECT cost_centers.co_email FROM cost_centers WHERE cost_centers.id = requests.cost_center_id OR cost_centers.code = (requests.data->>'costCenter') OR cost_centers.name = (requests.data->>'costCenter')
      ))
    );

END $$;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS set_requests_updated_at ON public.requests;
CREATE TRIGGER set_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
