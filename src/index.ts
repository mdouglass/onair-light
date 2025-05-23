import { DeviceStateDurableObject } from './durable-objects/device-state'
import { handleOnAir } from './routes/onair'
import { errorResponse } from './utils/response'

export default {
  async fetch(req, env, _ctx): Promise<Response> {
    try {
      // check the incoming request to make sure that the authorization header has a bearer token equal to env.ONAIR_TOKEN
      const authHeader = req.headers.get('authorization')
      const [authScheme, token, ...rest] = (authHeader ?? '').split(' ')
      if (
        authScheme.localeCompare('bearer', 'en', { sensitivity: 'accent' }) !== 0 ||
        token !== env.ONAIR_TOKEN ||
        rest.length > 0
      ) {
        throw errorResponse('Unauthorized', { status: 401 })
      }

      const url = URL.parse(req.url)
      switch (url?.pathname) {
        case '/onair':
          return handleOnAir(req, env)
        default:
          return new Response('Not Found', { status: 404 })
      }
    } catch (e) {
      if (e instanceof Response) {
        return e
      }
      return errorResponse(e, { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>

export { DeviceStateDurableObject } from './durable-objects/device-state'
