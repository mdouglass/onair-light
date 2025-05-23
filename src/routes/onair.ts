import { z } from 'zod/v4'
import { errorResponse, okResponse } from '../utils/response'

const OnAirRequestSchema = z.object({
  machine: z.string(),
  device: z.enum(['camera', 'microphone']),
  state: z.boolean(),
})

function parseRequestBody(data: string) {
  try {
    return OnAirRequestSchema.parse(data)
  } catch (e) {
    throw errorResponse(e, { status: 400 })
  }
}

export async function handleOnAir(req: Request, env: Env): Promise<Response> {
  switch (req.method) {
    case 'POST': {
      const body = parseRequestBody(await req.json())

      const id = env.DEVICE_STATE.idFromName('global')
      const obj = env.DEVICE_STATE.get(id)
      const result = await obj.setDeviceState(body.machine, body.device, body.state)

      return okResponse(result)
    }
    case 'GET': {
      const id = env.DEVICE_STATE.idFromName('global')
      const obj = env.DEVICE_STATE.get(id)
      const result = await obj.getDeviceState()
      return okResponse(result)
    }
    case 'DELETE': {
      const id = env.DEVICE_STATE.idFromName('global')
      const obj = env.DEVICE_STATE.get(id)
      await obj.deleteAll()
      return okResponse({ state: false, updatedAt: 0 })
    }
    default:
      throw errorResponse('Method Not Allowed', { status: 405 })
  }
}
