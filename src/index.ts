export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = URL.parse(request.url)
    switch (url?.pathname) {
      default:
        return new Response('Not Found', { status: 404 })
    }
  },
} satisfies ExportedHandler<Env>
