// Edge Function "lembretes": chamada pelo pg_cron a cada 15 minutos (ver supabase/schema.sql).
// Envia "Estou com sede!" a quem já passou do horário escolhido e ainda não estudou hoje.
// Segredos (Edge Functions > Secrets): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (ex.: mailto:voce@exemplo.com).
// Pode ser chamada por qualquer pessoa sem risco: só envia a quem está no horário e no máximo uma vez por dia.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'npm:@supabase/supabase-js@2'

webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')!, Deno.env.get('VAPID_PUBLIC_KEY')!, Deno.env.get('VAPID_PRIVATE_KEY')!)
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

/** Data "AAAA-MM-DD", ontem e hora "HH:MM" no fuso do usuário. */
function localNow(tz: string, now: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(now).map((x) => [x.type, x.value]),
  )
  const today = `${p.year}-${p.month}-${p.day}`
  const yesterday = new Date(Date.UTC(+p.year, +p.month - 1, +p.day - 1)).toISOString().slice(0, 10)
  return { today, yesterday, hm: `${p.hour}:${p.minute}` }
}

Deno.serve(async () => {
  const { data: subs, error } = await db.from('push_subscriptions').select('*')
  if (error) return Response.json({ error: error.message }, { status: 500 })
  const now = new Date()
  let sent = 0

  for (const s of subs ?? []) {
    let t
    try { t = localNow(s.tz || 'America/Sao_Paulo', now) } catch { t = localNow('America/Sao_Paulo', now) }
    if (s.last_sent === t.today || t.hm < s.remind_at) continue

    const { data: p } = await db.from('progress').select('data').eq('user_id', s.user_id).maybeSingle()
    const st = p?.data
    if (st?.lastDay === t.today) continue // já regou hoje
    const streak = st?.lastDay === t.yesterday ? st.streak : 0
    const body = streak > 0
      ? `Faça a lição de hoje para manter ${streak} ${streak === 1 ? 'dia regado' : 'dias regados'}.`
      : 'Uma lição rapidinha hoje e eu volto a crescer.'

    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title: 'Estou com sede!', body }))
      sent++
    } catch (e) {
      // aparelho desinstalou ou bloqueou: apaga a inscrição para não tentar de novo
      if (e?.statusCode === 404 || e?.statusCode === 410) await db.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
      else console.error('falha ao enviar', e?.statusCode, e?.body)
      continue
    }
    await db.from('push_subscriptions').update({ last_sent: t.today }).eq('endpoint', s.endpoint)
  }
  return Response.json({ sent })
})
