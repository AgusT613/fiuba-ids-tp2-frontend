import { error } from '@sveltejs/kit';
import { API_URL } from '#lib/constantes/index';

export async function load({ params }) {
	const url = new URL(`${API_URL}/equipos/${params.id}`);
	const response = await fetch(url);
	if (!response.ok) {
		error(response.status, 'No se pudo cargar el equipo');
	}

	const equipo = await response.json();
	const pokemonsRes = await fetch(`${API_URL}/pokemon/?limit=100&offset=0`);
	const pokemonsDisponibles = pokemonsRes.ok ? await pokemonsRes.json() : [];
	const movimientosRes = await fetch(`${API_URL}/movimientos/`);
	const movimientos = movimientosRes.ok ? await movimientosRes.json() : [];

	return {
		equipo,
		pokemonsDisponibles,
		movimientos
	};
}

export const actions = {
	eliminar_integrante: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const integrante_id = data.get('integrante_id');
		const url = new URL(`${API_URL}/equipos/${id_equipo}/integrantes/${integrante_id}`);

		const response = await fetch(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'No se pudo eliminar al integrante');
		}
		return { success: true };
	},

	eliminar_movimiento: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const id_integrante = data.get('id_integrante');
		const id_movimiento = parseInt(data.get('id_movimiento'));

		// Primero intentamos DELETE directo si existe
		const urlDelete = `${API_URL}/equipos/${id_equipo}/integrantes/${id_integrante}/movimientos/${id_movimiento}`;
		const res = await fetch(urlDelete, { method: 'DELETE' });
		if (!res.ok) {
			// Si el endpoint específico DELETE no existe, actualizamos los movimientos del integrante mediante PUT
			const equipoRes = await fetch(`${API_URL}/equipos/${id_equipo}`);
			if (equipoRes.ok) {
				const equipo = await equipoRes.json();
				const integrante = equipo.integrantes?.find((i) => i.id == id_integrante);
				if (integrante) {
					const nuevosMovs = (integrante.movimientos || [])
						.filter((m) => m.id !== id_movimiento)
						.map((m) => m.id);
					const putUrl = `${API_URL}/equipos/${id_equipo}/integrantes/${id_integrante}`;
					const putRes = await fetch(putUrl, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							apodo: integrante.apodo || 'Sin-Nombre',
							movimientos: nuevosMovs
						})
					});
					if (!putRes.ok) {
						throw error(putRes.status, 'Error al desvincular el movimiento');
					}
				}
			}
		}
		return { success: true };
	},

	actualizar_equipo: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const url = new URL(`${API_URL}/equipos/${id_equipo}`);
		const nombre = data.get('nombre');
		const id_generacion = parseInt(data.get('id_generacion'));

		const payload = { nombre, id_generacion };
		const response = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'Error al actualizar el equipo');
		}
		return { success: true };
	},

	agregar_integrante: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const payload = {
			apodo: data.get('apodo'),
			id_pokemon: parseInt(data.get('id_pokemon'))
		};
		const url = `${API_URL}/equipos/${id_equipo}/integrantes`;
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'Error al agregar el integrante');
		}
		return { success: true };
	},

	agregar_movimiento: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const id_integrante = data.get('id_integrante');
		const id_movimiento = parseInt(data.get('id_movimiento'));

		const payload = {
			id_movimiento: id_movimiento
		};

		const url = `${API_URL}/equipos/${id_equipo}/integrantes/${id_integrante}/movimientos`;
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'Error al agregar el movimiento');
		}
		return { success: true };
	},

	editar_integrante: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const id_integrante = data.get('id_integrante');
		const apodo = data.get('apodo');

		// Obtener el equipo completo para preservar movimientos
		const equipoUrl = `${API_URL}/equipos/${id_equipo}`;
		const equipoResponse = await fetch(equipoUrl);
		if (!equipoResponse.ok) {
			throw error(equipoResponse.status, 'Error al obtener el equipo');
		}
		const equipo = await equipoResponse.json();

		const integrante = equipo.integrantes.find((i) => i.id == id_integrante);
		if (!integrante) {
			throw error(404, 'Integrante no encontrado');
		}

		const payload = {
			apodo: apodo || 'Sin-Nombre',
			movimientos: integrante.movimientos?.map((m) => m.id) || []
		};

		const url = `${API_URL}/equipos/${id_equipo}/integrantes/${id_integrante}`;
		const response = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'Error al editar el apodo del integrante');
		}
		return { success: true };
	},

	actualizar_integrante: async ({ request }) => {
		const data = await request.formData();
		const id_equipo = data.get('id_equipo');
		const id_integrante = data.get('id_integrante');
		let apodo = data.get('apodo') || 'Sin-Nombre';
		const movimientos = data
			.getAll('movimientos')
			.map((id) => parseInt(id))
			.filter((id) => !isNaN(id));

		const payload = { apodo, movimientos };
		const url = `${API_URL}/equipos/${id_equipo}/integrantes/${id_integrante}`;

		const response = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const msg = await response.text();
			throw error(response.status, msg || 'Error al actualizar el integrante');
		}
		return { success: true };
	}
};
