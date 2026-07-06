-- Create reimbursement_dashboard_view: a read-only view for dashboard metrics, aging, and filtered states.
-- Idempotent: uses CREATE OR REPLACE VIEW. No changes to requests table, RLS, or workflow logic.

CREATE OR REPLACE VIEW public.reimbursement_dashboard_view AS
SELECT
  r.id AS request_id,
  r.requester_id,
  p.name AS requester_name,
  p.email AS requester_email,
  r.event_id,
  e.name AS event_name,
  r.cost_center_id,
  cc.code AS cost_center_code,
  cc.name AS cost_center_name,
  r.status,
  CASE
    WHEN r.status IN ('Pending', 'PENDING_QC') THEN 'Quality Control Review'
    WHEN r.status IN ('Checked', 'PENDING_CO') THEN 'Certifying Officer Review'
    WHEN r.status IN ('Approved', 'APPROVED_BY_CO') THEN 'Finance Processing'
    WHEN r.status = 'Processed' THEN 'Completed'
    WHEN r.status IN ('Rejected', 'REJECTED_BY_QC', 'REJECTED_BY_CO') THEN 'Rejected'
    ELSE 'Unknown'
  END AS current_stage,
  CASE
    WHEN r.status IN ('Pending', 'PENDING_QC') THEN 'QC'
    WHEN r.status IN ('Checked', 'PENDING_CO') THEN 'CO'
    WHEN r.status IN ('Approved', 'APPROVED_BY_CO') THEN 'Finance'
    WHEN r.status = 'Processed' THEN NULL
    WHEN r.status IN ('Rejected', 'REJECTED_BY_QC', 'REJECTED_BY_CO') THEN NULL
    ELSE NULL
  END AS current_responsible_role,
  r.payment_method,
  NULLIF(
    COALESCE(
      NULLIF(r.data->>'amountEuros', '')::numeric,
      NULLIF(r.data->>'amount_eur', '')::numeric,
      NULLIF(r.data->>'amount', '')::numeric
    ),
    NULL
  ) AS amount_eur,
  r.created_at AS submitted_at,
  r.updated_at,
  r.updated_at AS stage_started_at,
  FLOOR(EXTRACT(EPOCH FROM (now() - r.created_at)) / 86400)::int AS days_since_submission,
  FLOOR(EXTRACT(EPOCH FROM (now() - COALESCE(r.updated_at, r.created_at))) / 86400)::int AS days_in_current_stage,
  r.qc_rejection_reason,
  r.co_rejection_reason,
  COALESCE(r.qc_rejection_reason, r.co_rejection_reason) AS rejection_reason,
  CASE
    WHEN r.status IN ('REJECTED_BY_QC', 'REJECTED_BY_CO', 'Pending')
      OR r.status ILIKE '%pending_requester%'
    THEN true
    ELSE false
  END AS is_pending_requester,
  CASE WHEN r.status IN ('Pending', 'PENDING_QC') THEN true ELSE false END AS is_pending_qc,
  CASE WHEN r.status IN ('PENDING_CO', 'Checked') THEN true ELSE false END AS is_pending_co,
  CASE WHEN r.status IN ('Approved', 'APPROVED_BY_CO') THEN true ELSE false END AS is_pending_finance,
  CASE WHEN r.status = 'Processed' THEN true ELSE false END AS is_processed,
  CASE WHEN r.status IN ('Rejected', 'REJECTED_BY_QC', 'REJECTED_BY_CO') THEN true ELSE false END AS is_rejected,
  CASE
    WHEN FLOOR(EXTRACT(EPOCH FROM (now() - COALESCE(r.updated_at, r.created_at))) / 86400)::int > 2
    THEN true
    ELSE false
  END AS is_delayed_48h,
  r.data
FROM public.requests r
LEFT JOIN public.profiles p ON r.requester_id = p.id
LEFT JOIN public.events e ON r.event_id = e.id
LEFT JOIN public.cost_centers cc ON r.cost_center_id = cc.id;

-- Grant read access to authenticated users (view-level; underlying table RLS still applies)
GRANT SELECT ON public.reimbursement_dashboard_view TO authenticated;
