<script>
	import { enhance } from '$app/forms';
	import Pagination from '#lib/components/Pagination.svelte';

	let { data } = $props();

	let busquedaEquipo = $state('');
	let mostrarFormulario = $state(false);
	let exito = $state(false);
	let vistaModo = $state('tarjetas'); // 'tarjetas' | 'tabla'

	let equiposFiltrados = $derived(
		(data.equipos || []).filter((e) =>
			e.nombre.toLowerCase().includes(busquedaEquipo.trim().toLowerCase())
		)
	);

	function mostrarBannerEquipoCreado() {
		exito = true;
		mostrarFormulario = false;
		setTimeout(() => {
			exito = false;
		}, 4000);
	}

	function confirmarEliminacion(e) {
		if (!confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
			e.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Equipos Pokémon - IntroDex</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto space-y-8">
		<!-- Breadcrumbs y Título -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
					<a href="/" class="hover:text-blue-600 transition-colors">Inicio</a>
					<span>&bull;</span>
					<span class="text-slate-800 font-medium">Equipos</span>
				</nav>
				<h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
					Gestor de Equipos
				</h1>
				<p class="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
					Crea, organiza y perfecciona tus alineaciones de hasta 6 Pokémon para competir.
				</p>
			</div>

			<div class="flex items-center gap-3 self-start sm:self-auto">
				<button
					type="button"
					onclick={() => (mostrarFormulario = !mostrarFormulario)}
					class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={mostrarFormulario ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'}
						></path>
					</svg>
					<span>{mostrarFormulario ? 'Cerrar formulario' : 'Nuevo Equipo'}</span>
				</button>

				<a
					href="/"
					class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
					Menú Principal
				</a>
			</div>
		</div>

		<!-- MENSAJE DE ÉXITO -->
		{#if exito}
			<div
				class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center justify-between shadow-xs"
			>
				<div class="flex items-center gap-3">
					<div
						class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
					</div>
					<div>
						<h4 class="font-bold text-sm text-emerald-900">¡Equipo registrado exitosamente!</h4>
						<p class="text-xs text-emerald-700">
							Ya puedes acceder a él para incorporar integrantes y configurar sus ataques.
						</p>
					</div>
				</div>
				<button
					onclick={() => (exito = false)}
					class="text-emerald-500 hover:text-emerald-700 p-1 cursor-pointer"
				>
					&times;
				</button>
			</div>
		{/if}

		<!-- FORMULARIO CREAR EQUIPO (CARD COLLAPSIBLE) -->
		{#if mostrarFormulario}
			<div class="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
				<div class="flex items-center justify-between border-b border-slate-100 pb-4">
					<div>
						<h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
							<svg
								class="w-5 h-5 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							Crear Nuevo Equipo
						</h2>
						<p class="text-xs text-slate-500 mt-1">
							Define el nombre del equipo y su generación base para comenzar a agregar integrantes.
						</p>
					</div>
				</div>

				<form
					method="POST"
					action="?/create"
					class="space-y-4"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							mostrarBannerEquipoCreado();
						};
					}}
				>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label
								for="nombre-equipo"
								class="text-xs font-bold uppercase tracking-wider text-slate-500"
							>
								Nombre del Equipo
							</label>
							<input
								id="nombre-equipo"
								name="nombre"
								type="text"
								autocomplete="off"
								required
								placeholder="Ej: Dream Team Kanto, Escuadrón Dragón..."
								class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
							<span class="text-[11px] text-slate-400 block">El nombre debe ser único.</span>
						</div>

						<div class="space-y-1.5">
							<label
								for="generacion-equipo"
								class="text-xs font-bold uppercase tracking-wider text-slate-500"
							>
								Generación
							</label>
							<select
								id="generacion-equipo"
								name="id_generacion"
								required
								class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
							>
								<option value="">-- Seleccionar Generación --</option>
								<option value="1">Generación I</option>
								<option value="2">Generación II</option>
								<option value="3">Generación III</option>
								<option value="4">Generación IV</option>
								<option value="5">Generación V</option>
								<option value="6">Generación VI</option>
								<option value="7">Generación VII</option>
								<option value="8">Generación VIII</option>
							</select>
							<span class="text-[11px] text-slate-400 block">
								Establece la regla generacional del equipo.
							</span>
						</div>
					</div>

					<div class="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onclick={() => (mostrarFormulario = false)}
							class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
							<span>Guardar Equipo</span>
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- BARRA DE BÚSQUEDA Y CONTROL DE VISTA -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="relative max-w-sm flex-1">
				<input
					type="text"
					bind:value={busquedaEquipo}
					placeholder="Buscar equipo por nombre..."
					class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs transition-all"
				/>
				<svg
					class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					></path>
				</svg>
			</div>

			<div class="flex items-center justify-between sm:justify-end gap-4 flex-wrap">
				<span class="text-sm font-medium text-slate-500">
					{equiposFiltrados.length}
					{equiposFiltrados.length === 1 ? 'equipo' : 'equipos'}
				</span>

				<!-- Switch vista Tarjetas / Tabla -->
				<div class="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
					<button
						onclick={() => (vistaModo = 'tarjetas')}
						title="Vista en tarjetas"
						class="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {vistaModo ===
						'tarjetas'
							? 'bg-blue-50 text-blue-600'
							: 'text-slate-400 hover:text-slate-700'}"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							></path>
						</svg>
					</button>
					<button
						onclick={() => (vistaModo = 'tabla')}
						title="Vista en tabla"
						class="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {vistaModo ===
						'tabla'
							? 'bg-blue-50 text-blue-600'
							: 'text-slate-400 hover:text-slate-700'}"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							></path>
						</svg>
					</button>
				</div>

				<!-- Paginación superior -->
				<Pagination
					currentPage={data.currentPage}
					pageSize={data.pageSize}
					hasMore={data.hasMore}
				/>
			</div>
		</div>

		<!-- LISTADO DE EQUIPOS: TARJETAS O TABLA -->
		{#if equiposFiltrados && equiposFiltrados.length > 0}
			{#if vistaModo === 'tarjetas'}
				<!-- Grid de Tarjetas de Equipos -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each equiposFiltrados as equipo}
						<div
							class="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between gap-6"
						>
							<!-- Cabecera de la tarjeta -->
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<span
										class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"
									>
										<span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
										{equipo.generacion.nombre}
									</span>

									<!-- Formulario Eliminar -->
									<form action="?/eliminar_equipo" method="POST" onsubmit={confirmarEliminacion}>
										<input type="hidden" name="id_equipo" value={equipo.id} />
										<button
											type="submit"
											title="Eliminar este equipo"
											class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												></path>
											</svg>
										</button>
									</form>
								</div>

								<div>
									<a href={`/equipos/${equipo.id}`}>
										<h3
											class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize"
										>
											{equipo.nombre}
										</h3>
									</a>
								</div>

								<!-- Indicador visual de 6 integrantes -->
								<div class="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
									<div
										class="flex items-center justify-between text-xs font-semibold text-slate-600"
									>
										<span>Integrantes</span>
										<span class="font-mono text-slate-800">
											{equipo.cantidad_integrantes || 0} / 6
										</span>
									</div>

									<!-- 6 slots de Pokéball / miembros -->
									<div class="grid grid-cols-6 gap-1.5">
										{#each Array(6) as _, i}
											<div
												class="h-2 rounded-full transition-all {i <
												(equipo.cantidad_integrantes || 0)
													? 'bg-blue-600'
													: 'bg-slate-200'}"
											></div>
										{/each}
									</div>
								</div>
							</div>

							<!-- Botón Gestionar -->
							<a
								href={`/equipos/${equipo.id}`}
								class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white font-medium text-sm transition-all text-center cursor-pointer active:scale-95"
							>
								<span>Gestionar Equipo</span>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									></path>
								</svg>
							</a>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Vista de Tabla Moderna -->
				<div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm border-collapse">
							<thead>
								<tr
									class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200"
								>
									<th class="p-4 font-semibold">Nombre del Equipo</th>
									<th class="p-4 font-semibold">Generación</th>
									<th class="p-4 font-semibold text-center">Integrantes</th>
									<th class="p-4 font-semibold text-center">Estado</th>
									<th class="p-4 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each equiposFiltrados as equipo}
									<tr class="hover:bg-slate-50/80 transition-colors">
										<td class="p-4 font-bold text-slate-800 capitalize text-base">
											<a
												href={`/equipos/${equipo.id}`}
												class="hover:text-blue-600 transition-colors"
											>
												{equipo.nombre}
											</a>
										</td>
										<td class="p-4 text-slate-600">
											<span
												class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700"
											>
												{equipo.generacion.nombre}
											</span>
										</td>
										<td class="p-4 text-center font-mono font-bold text-slate-800">
											{equipo.cantidad_integrantes || 0} / 6
										</td>
										<td class="p-4 text-center">
											{#if (equipo.cantidad_integrantes || 0) === 6}
												<span
													class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
												>
													Completo
												</span>
											{:else}
												<span
													class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
												>
													En desarrollo
												</span>
											{/if}
										</td>
										<td class="p-4 text-right">
											<div class="inline-flex items-center gap-2">
												<a
													href={`/equipos/${equipo.id}`}
													class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-medium text-xs transition-colors cursor-pointer"
												>
													<span>Ver</span>
													<svg
														class="w-3.5 h-3.5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 5l7 7-7 7"
														></path>
													</svg>
												</a>

												<form
													action="?/eliminar_equipo"
													method="POST"
													onsubmit={confirmarEliminacion}
												>
													<input type="hidden" name="id_equipo" value={equipo.id} />
													<button
														type="submit"
														title="Eliminar este equipo"
														class="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
													>
														<svg
															class="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															></path>
														</svg>
													</button>
												</form>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Paginación Inferior -->
			<div class="flex justify-center pt-4">
				<Pagination
					currentPage={data.currentPage}
					pageSize={data.pageSize}
					hasMore={data.hasMore}
				/>
			</div>
		{:else}
			<!-- Estado Vacío -->
			<div
				class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm"
			>
				<div
					class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl"
				>
					🛡️
				</div>
				<h3 class="text-xl font-bold text-slate-800">
					{busquedaEquipo.trim() ? 'No se encontraron equipos' : 'Aún no tienes equipos'}
				</h3>
				<p class="text-sm text-slate-600">
					{busquedaEquipo.trim()
						? `No existen equipos con el nombre "${busquedaEquipo}". Intenta con otro término.`
						: 'Crea tu primera formación competitiva y comienza a configurar sus integrantes y movimientos.'}
				</p>
				{#if !mostrarFormulario}
					<button
						onclick={() => (mostrarFormulario = true)}
						class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
					>
						Crear mi primer equipo
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
