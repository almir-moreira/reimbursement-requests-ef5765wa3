-- Allow QC users to also delete requests alongside admins
DROP POLICY IF EXISTS "Users can delete own requests or admin" ON public.requests;
CREATE POLICY "Users can delete own requests or admin" ON public.requests
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'qc')
    )
  );
