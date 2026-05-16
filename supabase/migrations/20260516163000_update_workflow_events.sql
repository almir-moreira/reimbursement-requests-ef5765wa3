DO $$
BEGIN
    -- Rename action to event_type if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_events' AND column_name = 'action') THEN
        ALTER TABLE public.workflow_events RENAME COLUMN action TO event_type;
    END IF;

    -- Rename comments to rejection_reason if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_events' AND column_name = 'comments') THEN
        ALTER TABLE public.workflow_events RENAME COLUMN comments TO rejection_reason;
    END IF;

    -- Add processed_at
    ALTER TABLE public.workflow_events ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

    -- Drop obsolete columns
    ALTER TABLE public.workflow_events DROP COLUMN IF EXISTS status_from;
    ALTER TABLE public.workflow_events DROP COLUMN IF EXISTS status_to;
    ALTER TABLE public.workflow_events DROP COLUMN IF EXISTS created_by;
    ALTER TABLE public.workflow_events DROP COLUMN IF EXISTS processed;

    -- Clean up invalid data before constraint
    UPDATE public.workflow_events 
    SET event_type = 'REQUEST_CREATED' 
    WHERE event_type NOT IN ('REQUEST_CREATED', 'QC_APPROVED', 'QC_REJECTED', 'CO_APPROVED', 'CO_REJECTED');

    -- Add Check constraint
    ALTER TABLE public.workflow_events DROP CONSTRAINT IF EXISTS workflow_events_event_type_check;
    ALTER TABLE public.workflow_events ADD CONSTRAINT workflow_events_event_type_check 
        CHECK (event_type IN ('REQUEST_CREATED', 'QC_APPROVED', 'QC_REJECTED', 'CO_APPROVED', 'CO_REJECTED'));
END $$;
