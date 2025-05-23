function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  })
}

export function okResponse(data: unknown, init?: ResponseInit): Response {
  return jsonResponse({ ok: true, value: data })
}

export function errorResponse(e: unknown, init?: ResponseInit): Response {
  let message: string
  let status: number
  if (e instanceof Error) {
    message = e.message
    status = (e as { status?: number }).status ?? (e as { statusCode?: number }).statusCode ?? 500
  } else {
    message = String(e)
    status = 500
  }
  return jsonResponse({ ok: false, error: { message } }, { status, ...init })
}
