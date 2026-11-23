import { sb } from './supabase.js'

const KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

// O service worker só existe no build publicado; no `npm run dev` os lembretes ficam desligados.
export const pushSupported = () =>
  !!(sb && KEY && import.meta.env.PROD && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)

const toBytes = (b64) =>
  Uint8Array.from(atob((b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

async function subscription() {
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

/** Horário do lembrete deste aparelho ("HH:MM") ou null se estiver desligado. */
export async function currentReminder() {
  const sub = await subscription()
  if (!sub) return null
  const { data } = await sb.from('push_subscriptions').select('remind_at').eq('endpoint', sub.endpoint).maybeSingle()
  return data?.remind_at || null
}

/** Pede permissão (se preciso) e salva o horário. Lança 'denied' se o usuário recusar. */
export async function enableReminder(time) {
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('denied')
  const reg = await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toBytes(KEY) }))
  const { endpoint, keys } = sub.toJSON()
  const { error } = await sb.from('push_subscriptions').upsert({
    endpoint, p256dh: keys.p256dh, auth: keys.auth, remind_at: time,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone, last_sent: null,
  })
  if (error) throw error
}

export async function disableReminder() {
  if (!pushSupported()) return
  const sub = await subscription()
  if (!sub) return
  await sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
  await sub.unsubscribe()
}
