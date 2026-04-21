import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as XLSX from 'npm:xlsx@0.18.5';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'finance'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: "A", defval: "" });

    const validRows = [];
    for (const row of data as any[]) {
      const country = String(row['A'] || '').trim();
      const currency = String(row['B'] || '').trim();
      const currencyCode = String(row['C'] || '').trim();
      
      // Skip possible header rows
      if (!country || country.toLowerCase() === 'country' || currencyCode.toLowerCase() === 'currency code' || currencyCode.toLowerCase() === 'currency_code') {
        continue;
      }
      
      let effectiveDate = row['D'];
      if (typeof effectiveDate === 'number') {
        const date = new Date(Math.round((effectiveDate - 25569) * 86400 * 1000));
        effectiveDate = date.toISOString().split('T')[0];
      } else if (typeof effectiveDate === 'string') {
        const parsed = new Date(effectiveDate);
        if (!isNaN(parsed.getTime())) {
          effectiveDate = parsed.toISOString().split('T')[0];
        }
      }

      const operationalRate = parseFloat(row['E']);

      if (country && currency && currencyCode && effectiveDate && !isNaN(operationalRate)) {
        validRows.push({
          Country: country,
          Currency: currency,
          Currency_Code: currencyCode,
          Effective_Date: effectiveDate,
          Operational_Rate: Number(operationalRate.toFixed(2))
        });
      }
    }

    if (validRows.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid rows found in the file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean existing table
    const { error: deleteError } = await supabaseClient
      .from('exchange_rates')
      .delete()
      .neq('Currency_Code', 'DO_NOT_DELETE_NON_EXISTENT');
      
    if (deleteError) throw deleteError;

    // Insert new data
    const { error: insertError } = await supabaseClient.from('exchange_rates').insert(validRows);
    if (insertError) throw insertError;

    // Log the import
    await supabaseClient.from('exchange_rates_log').insert({
      processed_rows: validRows.length,
      imported_by: user.id
    });

    return new Response(JSON.stringify({ 
      success: true, 
      processed: validRows.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
