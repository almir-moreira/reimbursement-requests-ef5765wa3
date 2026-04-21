-- Drop dependent policies first
DROP POLICY IF EXISTS "Enable all access for admin" ON public.exchange_rates;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.exchange_rates;
DROP POLICY IF EXISTS "Enable all access for finance" ON public.exchange_rates;

-- Recreate the table with exact fields
DROP TABLE IF EXISTS public.exchange_rates;

CREATE TABLE public.exchange_rates (
    "Currency_Code" VARCHAR(20) PRIMARY KEY,
    "Country" VARCHAR(100),
    "Currency" VARCHAR(100),
    "Effective_Date" DATE,
    "Operational_Rate" NUMERIC(10,2)
);

ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users" 
    ON public.exchange_rates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable all access for admin and finance" 
    ON public.exchange_rates FOR ALL TO authenticated 
    USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'finance') )
    );

-- Log table
CREATE TABLE IF NOT EXISTS public.exchange_rates_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    processed_rows INTEGER NOT NULL,
    imported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.exchange_rates_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated" 
    ON public.exchange_rates_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin and finance" 
    ON public.exchange_rates_log FOR INSERT TO authenticated 
    WITH CHECK (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'finance') )
    );
