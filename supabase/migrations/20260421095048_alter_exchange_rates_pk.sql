-- Drop dependent policies first
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.exchange_rates;
DROP POLICY IF EXISTS "Enable all access for admin and finance" ON public.exchange_rates;

-- Remove rows with NULL country
DELETE FROM public.exchange_rates WHERE "Country" IS NULL;

-- Remove duplicates based on Country before applying primary key
DELETE FROM public.exchange_rates WHERE ctid NOT IN (
    SELECT MIN(ctid) FROM public.exchange_rates GROUP BY "Country"
);

-- Alter table to change primary key
ALTER TABLE public.exchange_rates DROP CONSTRAINT IF EXISTS exchange_rates_pkey;
ALTER TABLE public.exchange_rates ALTER COLUMN "Country" SET NOT NULL;
ALTER TABLE public.exchange_rates ADD PRIMARY KEY ("Country");

-- Recreate policies
CREATE POLICY "Enable read access for all authenticated users" 
    ON public.exchange_rates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable all access for admin and finance" 
    ON public.exchange_rates FOR ALL TO authenticated 
    USING (
        EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'finance') )
    );
