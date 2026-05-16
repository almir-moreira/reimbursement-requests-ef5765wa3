CREATE OR REPLACE VIEW public.v_request_workflow_context AS
SELECT 
    r.id AS request_id,
    r.id AS request_number,
    r.status,
    r.payment_method,
    p.name AS requester_name,
    p.email AS requester_email,
    e.qc_name,
    e.qc_email,
    c.co_name,
    c.co_email,
    'Finance@kaiciid.org'::text AS finance_email,
    r.qc_rejection_reason,
    r.co_rejection_reason,
    r.created_at,
    r.updated_at
FROM 
    public.requests r
LEFT JOIN 
    public.profiles p ON r.requester_id = p.id
LEFT JOIN 
    public.events e ON r.event_id = e.id
LEFT JOIN 
    public.cost_centers c ON r.cost_center_id = c.id;
