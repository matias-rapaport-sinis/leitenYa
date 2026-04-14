const API_BASE = 'https://app.leiten.dnscheck.com.ar'

export async function loginFromAPP(codUsr, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ CodUsr: codUsr, PassWord: password, LoginAnonimo: false }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Error al iniciar sesión')
  }

  const data = await res.json()
  return data // expects { session_id: "...", ... }
}
