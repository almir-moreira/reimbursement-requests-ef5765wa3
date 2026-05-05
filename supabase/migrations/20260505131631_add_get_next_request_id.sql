CREATE OR REPLACE FUNCTION public.get_next_request_id(req_year text)
RETURNS text AS $function$
DECLARE
  next_num int;
BEGIN
  -- We query all requests, ignoring RLS policies due to SECURITY DEFINER,
  -- so we can guarantee the correct max sequence ID is retrieved.
  SELECT COALESCE(MAX(SUBSTRING(id FROM '-([0-9]+)$')::int), 0) + 1
  INTO next_num
  FROM public.requests
  WHERE id LIKE req_year || '-%' AND id ~ '-[0-9]+$';

  RETURN req_year || '-' || LPAD(next_num::text, 4, '0');
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;
