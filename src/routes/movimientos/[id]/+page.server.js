import { error } from '@sveltejs/kit';
import { API_URL } from '#lib/constantes/index';

export async function load({ params }) {
	let url = new URL(`${API_URL}/movimientos/${params.id}`);
	const response = await fetch(url);
	if (!response.ok) {
		error(response.status);
	}

	let movimiento = await response.json();

	return {
		movimiento
	};
}
