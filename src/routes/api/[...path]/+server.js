import { API_URL } from '#lib/constantes/index';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	if (!API_URL) {
		return new Response(JSON.stringify({ error: 'API_URL environment variable is not defined' }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}

	const base = API_URL.replace(/\/+$/, '');
	const targetUrl = new URL(`${base}/${params.path}`);

	url.searchParams.forEach((value, key) => {
		targetUrl.searchParams.set(key, value);
	});

	try {
		const response = await fetch(targetUrl.toString());
		const data = await response.text();

		return new Response(data, {
			status: response.status,
			headers: {
				'content-type': response.headers.get('content-type') || 'application/json'
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Backend unreachable', details: String(err) }), {
			status: 502,
			headers: { 'content-type': 'application/json' }
		});
	}
}
