import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || profile.role !== 'admin')
      throw new Error('Forbidden: Only admins can manage users')

    const { action, payload } = await req.json()

    if (action === 'create') {
      const { email, password, name, role, ...rest } = payload

      if (!email || !name) {
        throw new Error('Email and name are required')
      }

      const { data: newAuthUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password: password || 'Default@123!',
        email_confirm: true,
        user_metadata: { name },
      })
      if (createError) throw createError

      const { error: profileError } = await supabaseClient.from('profiles').insert([
        {
          id: newAuthUser.user.id,
          email,
          name,
          role: role || 'requester',
          ...rest,
        },
      ])

      if (profileError) {
        // Rollback user creation if profile insert fails
        await supabaseClient.auth.admin.deleteUser(newAuthUser.user.id)
        throw profileError
      }

      return new Response(JSON.stringify({ success: true, user: newAuthUser.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      const { id } = payload
      if (!id) throw new Error('User ID is required')

      // Deleting from auth.users will cascade to public.profiles via foreign key
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(id)
      if (deleteError) throw deleteError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      const { id, password, email, name } = payload
      if (!id) throw new Error('User ID is required')

      const updateData: any = {}
      if (password) updateData.password = password
      if (email) updateData.email = email
      if (name) updateData.user_metadata = { name }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
          id,
          updateData,
        )
        if (updateError) throw updateError
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
