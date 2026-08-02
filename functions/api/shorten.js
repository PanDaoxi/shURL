export async function onRequestPost(context) {
	const { request, env } = context;
	const { url } = await request.json();

	if (!url) {
		return Response.json({ error: "Missing url" }, { status: 400 });
	}
	try {
		new URL(url);
	} catch {
		return Response.json({ error: "Invalid URL" }, { status: 400 });
	}
	const existing = await env.DB.prepare(
		"SELECT code FROM links WHERE url = ?",
	)
		.bind(url)
		.first();

	if (existing) {
		return Response.json({ code: existing.code });
	}
	let code;
	while (true) {
		code = generateCode(4);
		const exists = await env.DB.prepare(
			"SELECT code FROM links WHERE code = ?",
		)
			.bind(code)
			.first();
		if (!exists) break;
	}
	await env.DB.prepare("INSERT INTO links (code, url) VALUES (?, ?)")
		.bind(code, url)
		.run();

	return Response.json({ code });
}

function generateCode(length) {
	const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
