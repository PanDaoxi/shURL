export async function onRequestGet(context) {
	const { env, params } = context;
	const code = params.code;

	if (!code) {
		return context.next();
	}
	const link = await env.DB.prepare(
		"UPDATE links SET visits = visits + 1 WHERE code = ? RETURNING url",
	)
		.bind(code)
		.first();

	if (!link) {
		return new Response("404 Link not found", { status: 404 });
	}
	return Response.redirect(link.url, 302);
}
