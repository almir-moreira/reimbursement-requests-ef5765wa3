-- Enable pg_net extension for HTTP requests if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the trigger function for n8n to send only the required data
CREATE OR REPLACE FUNCTION public.notify_n8n_workflow_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  webhook_url text := 'https://almir-moreira.app.n8n.cloud/webhook-test/supabase-workflow-events';
  auth_header text := 'Bearer bi$coffk@ic11d';
  payload jsonb;
BEGIN
  -- Build the exact payload required by n8n (excluding sensitive or unnecessary data)
  payload := jsonb_build_object(
    'workflow_event_id', NEW.id,
    'request_id', NEW.request_id,
    'event_type', NEW.event_type,
    'rejection_reason', NEW.rejection_reason,
    'created_at', NEW.created_at
  );

  -- Send the webhook using pg_net (asynchronous, non-blocking)
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', auth_header
    ),
    body := payload
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ignore network/extension errors so the main transaction doesn't fail
  RETURN NEW;
END;
$function$;

-- Create or replace the trigger on workflow_events
DROP TRIGGER IF EXISTS workflow_events_to_n8n_trigger ON public.workflow_events;
CREATE TRIGGER workflow_events_to_n8n_trigger
  AFTER INSERT ON public.workflow_events
  FOR EACH ROW EXECUTE FUNCTION public.notify_n8n_workflow_event();

-- Ensure n8n (using authenticated or anon roles via API) has permission to query the context view
GRANT SELECT ON public.v_request_workflow_context TO authenticated;
GRANT SELECT ON public.v_request_workflow_context TO service_role;
GRANT SELECT ON public.v_request_workflow_context TO anon;
