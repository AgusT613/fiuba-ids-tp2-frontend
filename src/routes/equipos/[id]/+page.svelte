<script>
	import { enhance } from '$app/forms';
	import { API_URL } from '#lib/constantes/index';
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';
	import Typeahead from '#lib/components/Typeahead.svelte';

	let { data } = $props();

	// Modal states
	let modalEditarEquipo = $state(false);
	let modalCrearIntegrante = $state(false);
	let modalAgregarMovimiento = $state(false);
	let modalEditarIntegrante = $state(false);

	// Member and move selection states
	let pokemonSeleccionado = $state(null);
	let apodoNuevo = $state('');

	let integranteSeleccionadoParaMov = $state(null);
	let movimientoSeleccionado = $state(null);

	let integranteParaEditar = $state(null);
	let nuevoApodo = $state('');

	// Display toggle
	let vistaModo = $state('tarjetas'); // 'tarjetas' | 'tabla'

	// Alert feedback
	let mensajeError = $state('');
	let mensajeExito = $state('');

	$effect(() => {
		if (mensajeError || mensajeExito) {
			const timer = setTimeout(() => {
				mensajeError = '';
				mensajeExito = '';
			}, 4500);
			return () => clearTimeout(timer);
		}
	});

	// Helpers
	function abrirModalMovimiento(integrante) {
		if (integrante.movimientos && integrante.movimientos.length >= 4) {
			mensajeError = `"${integrante.apodo}" ya tiene el máximo permitido de 4 movimientos.`;
			return;
		}
		integranteSeleccionadoParaMov = integrante;
		movimientoSeleccionado = null;
		modalAgregarMovimiento = true;
	}

	function abrirModalEditarApodo(integrante) {
		integranteParaEditar = integrante;
		nuevoApodo = integrante.apodo || '';
		modalEditarIntegrante = true;
	}

	function categoriaColor(cat) {
		const c = (cat || '').toLowerCase();
		if (c === 'físico' || c === 'fisico') return 'bg-orange-100 text-orange-800 border-orange-200';
		if (c === 'especial') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
		return 'bg-slate-100 text-slate-700 border-slate-200';
	}

	function confirmarEliminarIntegrante(apodo) {
		return confirm(`¿Estás seguro de que deseas eliminar a "${apodo}" de este equipo?`);
	}

	function confirmarEliminarMovimiento(movNombre, apodo) {
		return confirm(`¿Deseas desvincular el movimiento "${movNombre}" del integrante "${apodo}"?`);
	}
</script>

<svelte:head>
	<title>{data.equipo.nombre} - Gestor de Equipo</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto space-y-8">
		<!-- BREADCRUMBS Y REGRESO -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
					<a href="/" class="hover:text-blue-600 transition-colors">Inicio</a>
					<span>&bull;</span>
					<a href="/equipos" class="hover:text-blue-600 transition-colors">Equipos</a>
					<span>&bull;</span>
					<span class="text-slate-800 font-medium">{data.equipo.nombre}</span>
				</nav>
				<div class="flex items-center gap-3 flex-wrap">
					<h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
						{data.equipo.nombre}
					</h1>
					{#if data.equipo.generacion}
						<span
							class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
							{data.equipo.generacion.nombre}
						</span>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-3 self-start sm:self-auto flex-wrap">
				<button
					type="button"
					onclick={() => (modalEditarEquipo = true)}
					class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
				>
					<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						></path>
					</svg>
					<span>Editar Equipo</span>
				</button>

				<a
					href="/equipos"
					class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
					<span>Todos los Equipos</span>
				</a>
			</div>
		</div>

		<!-- NOTIFICACIONES TOAST FLOTANTES -->
		{#if mensajeError}
			<div
				class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-fade-in"
			>
				<div class="flex items-center gap-2.5">
					<svg class="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="text-sm font-medium">{mensajeError}</span>
				</div>
				<button
					onclick={() => (mensajeError = '')}
					class="text-rose-400 hover:text-rose-700 text-lg leading-none cursor-pointer"
				>
					&times;
				</button>
			</div>
		{/if}

		{#if mensajeExito}
			<div
				class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-fade-in"
			>
				<div class="flex items-center gap-2.5">
					<svg class="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="text-sm font-medium">{mensajeExito}</span>
				</div>
				<button
					onclick={() => (mensajeExito = '')}
					class="text-emerald-400 hover:text-emerald-700 text-lg leading-none cursor-pointer"
				>
					&times;
				</button>
			</div>
		{/if}

		<!-- PANEL HERO DE ESTADO DEL EQUIPO -->
		<div
			class="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800"
		>
			<!-- Patrón de fondo sutil -->
			<div
				class="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
			></div>

			<div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
				<div class="space-y-3">
					<div
						class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/10 text-blue-200"
					>
						<span>Alineación Competitiva</span>
						<span>&bull;</span>
						<span>{data.equipo.integrantes.length} de 6 integrantes</span>
					</div>

					<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
						Roster Oficial de {data.equipo.nombre}
					</h2>

					<p class="text-slate-300 text-sm max-w-xl leading-relaxed">
						Gestiona los Pokémon integrantes, configura sus 4 movimientos de combate y personaliza
						sus apodos para optimizar tu estrategia.
					</p>

					<!-- Visualización de los 6 slots de Pokéballs -->
					<div class="flex items-center gap-2 pt-2">
						{#each Array(6) as _, i}
							{@const tieneIntegrante = i < data.equipo.integrantes.length}
							<div
								title={tieneIntegrante
									? `${data.equipo.integrantes[i].apodo} (${data.equipo.integrantes[i].pokemon.nombre})`
									: 'Slot disponible'}
								class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {tieneIntegrante
									? 'bg-red-500/90 border-white text-white shadow-md shadow-red-500/30'
									: 'bg-white/5 border-dashed border-white/30 text-white/40'}"
							>
								{#if tieneIntegrante}
									<span class="text-xs">⚪</span>
								{:else}
									<span class="text-xs font-mono">{i + 1}</span>
								{/if}
							</div>
						{/each}
						<span class="text-xs text-slate-400 font-medium ml-2">
							{data.equipo.integrantes.length === 6
								? '¡Equipo completo!'
								: `${6 - data.equipo.integrantes.length} vacantes`}
						</span>
					</div>
				</div>

				<!-- Botón de acción rápida: Agregar Integrante -->
				<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					{#if data.equipo.integrantes.length < 6}
						<button
							type="button"
							onclick={() => {
								pokemonSeleccionado = null;
								apodoNuevo = '';
								modalCrearIntegrante = true;
							}}
							class="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								></path>
							</svg>
							<span>Añadir Pokémon al Equipo</span>
						</button>
					{:else}
						<div
							class="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2"
						>
							<svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>Equipo en capacidad máxima (6/6)</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- BARRA DE VISTA: TARJETAS VS TABLA -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<h3 class="text-xl font-bold text-slate-800">
					Integrantes del Equipo
					<span class="text-sm font-normal text-slate-500">
						({data.equipo.integrantes.length}/6)
					</span>
				</h3>

				<!-- Switch vista Cuadrícula / Tabla -->
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
			</div>

			{#if data.equipo.integrantes.length > 0 && data.equipo.integrantes.length < 6}
				<button
					type="button"
					onclick={() => {
						pokemonSeleccionado = null;
						apodoNuevo = '';
						modalCrearIntegrante = true;
					}}
					class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					<span>Añadir otro integrante</span>
				</button>
			{/if}
		</div>

		<!-- ROSTER PRINCIPAL: TARJETAS O TABLA -->
		{#if data.equipo.integrantes && data.equipo.integrantes.length > 0}
			{#if vistaModo === 'tarjetas'}
				<!-- GRID DE TARJETAS DE INTEGRANTES -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{#each data.equipo.integrantes as integrante, index}
						<div
							class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between gap-5 relative overflow-hidden"
						>
							<!-- Encabezado de la tarjeta -->
							<div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
								<div class="flex items-center gap-3 min-w-0">
									<div
										class="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-slate-200"
									>
										#{index + 1}
									</div>

									<div class="min-w-0">
										<div class="flex items-center gap-2">
											<h4 class="text-lg font-extrabold text-slate-900 truncate">
												{integrante.apodo}
											</h4>
											<button
												type="button"
												onclick={() => abrirModalEditarApodo(integrante)}
												title="Editar apodo"
												class="text-slate-400 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
											>
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
														d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
													></path>
												</svg>
											</button>
										</div>
										<a
											href="/pokemones/{integrante.pokemon.id}"
											class="text-xs font-semibold text-blue-600 hover:underline capitalize inline-flex items-center gap-1"
										>
											<span>{integrante.pokemon.nombre}</span>
											<span class="text-slate-400 font-mono text-[11px]">
												(#{String(integrante.pokemon.id).padStart(3, '0')})
											</span>
										</a>
									</div>
								</div>

								<!-- Botón eliminar integrante -->
								<form
									action="?/eliminar_integrante"
									method="POST"
									use:enhance
									onsubmit={(e) => {
										if (!confirmarEliminarIntegrante(integrante.apodo)) {
											e.preventDefault();
										}
									}}
								>
									<input type="hidden" name="id_equipo" value={data.equipo.id} />
									<input type="hidden" name="integrante_id" value={integrante.id} />
									<button
										type="submit"
										title="Eliminar este integrante"
										class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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

							<!-- Cuerpo: Sprite, Tipos y Estadísticas principales -->
							<div class="grid grid-cols-12 gap-4 items-center">
								<!-- Sprite y Tipos -->
								<div class="col-span-4 flex flex-col items-center text-center">
									<a
										href="/pokemones/{integrante.pokemon.id}"
										class="group relative block p-2 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer"
									>
										<img
											src={integrante.pokemon.imagen}
											alt={integrante.pokemon.nombre}
											class="w-24 h-24 object-contain mx-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
										/>
									</a>
									<div class="flex flex-wrap gap-1 justify-center mt-2.5">
										{#each integrante.pokemon.tipos as t}
											<EtiquetaTipo tipo={t.nombre} tamaño="sm" />
										{/each}
									</div>
								</div>

								<!-- Mini Panel de Estadísticas -->
								<div
									class="col-span-8 space-y-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs"
								>
									<span
										class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1"
									>
										Estadísticas Base
									</span>
									<div class="grid grid-cols-2 gap-2">
										<div
											class="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs"
										>
											<span class="text-slate-500 font-medium">PS:</span>
											<span class="font-bold text-slate-800 font-mono">
												{integrante.pokemon.estadisticas?.puntos_de_golpe || '—'}
											</span>
										</div>
										<div
											class="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs"
										>
											<span class="text-slate-500 font-medium">Ataque:</span>
											<span class="font-bold text-slate-800 font-mono">
												{integrante.pokemon.estadisticas?.ataque || '—'}
											</span>
										</div>
										<div
											class="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs"
										>
											<span class="text-slate-500 font-medium">Defensa:</span>
											<span class="font-bold text-slate-800 font-mono">
												{integrante.pokemon.estadisticas?.defensa || '—'}
											</span>
										</div>
										<div
											class="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs"
										>
											<span class="text-slate-500 font-medium">Velocidad:</span>
											<span class="font-bold text-slate-800 font-mono">
												{integrante.pokemon.estadisticas?.velocidad || '—'}
											</span>
										</div>
									</div>
								</div>
							</div>

							<!-- SECCIÓN DE MOVIMIENTOS (4 SLOTS) -->
							<div class="space-y-2.5 pt-1 border-t border-slate-100">
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold uppercase tracking-wider text-slate-600">
										Movimientos ({integrante.movimientos?.length || 0}/4)
									</span>

									{#if !integrante.movimientos || integrante.movimientos.length < 4}
										<button
											type="button"
											onclick={() => abrirModalMovimiento(integrante)}
											class="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
										>
											<span>+ Aprender Movimiento</span>
										</button>
									{/if}
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
									{#each Array(4) as _, slotIdx}
										{@const mov = integrante.movimientos?.[slotIdx]}
										{#if mov}
											<!-- Slot ocupado -->
											<div
												class="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 transition-colors group"
											>
												<div class="min-w-0 flex-1">
													<div class="flex items-center gap-1.5 mb-1">
														<a
															href="/movimientos/{mov.id}"
															class="font-bold text-xs text-slate-800 hover:text-blue-600 transition-colors truncate block"
															title={mov.nombre}
														>
															{mov.nombre}
														</a>
													</div>
													<div class="flex items-center gap-1.5 flex-wrap">
														{#if mov.tipo}
															<EtiquetaTipo tipo={mov.tipo.nombre} tamaño="sm" />
														{/if}
														{#if mov.categoria}
															<span
																class="text-[10px] px-1.5 py-0.5 rounded border font-semibold capitalize {categoriaColor(
																	mov.categoria
																)}"
															>
																{mov.categoria}
															</span>
														{/if}
														<span class="text-[11px] font-mono text-slate-500 font-medium">
															Pot: {mov.potencia || '—'}
														</span>
													</div>
												</div>

												<!-- Botón para desvincular movimiento -->
												<form
													action="?/eliminar_movimiento"
													method="POST"
													use:enhance
													onsubmit={(e) => {
														if (!confirmarEliminarMovimiento(mov.nombre, integrante.apodo)) {
															e.preventDefault();
														}
													}}
												>
													<input type="hidden" name="id_equipo" value={data.equipo.id} />
													<input type="hidden" name="id_integrante" value={integrante.id} />
													<input type="hidden" name="id_movimiento" value={mov.id} />
													<button
														type="submit"
														title="Eliminar {mov.nombre}"
														class="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
													>
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
																d="M6 18L18 6M6 6l12 12"
															></path>
														</svg>
													</button>
												</form>
											</div>
										{:else}
											<!-- Slot vacío -->
											<button
												type="button"
												onclick={() => abrirModalMovimiento(integrante)}
												class="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 rounded-2xl p-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-all cursor-pointer font-medium"
											>
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
														d="M12 4v16m8-8H4"
													></path>
												</svg>
												<span>Slot {slotIdx + 1} Libre</span>
											</button>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					{/each}

					<!-- TARJETA INVITA A COMPLETAR EL EQUIPO SI HAY MENOS DE 6 INTEGRANTES -->
					{#if data.equipo.integrantes.length < 6}
						<button
							type="button"
							onclick={() => {
								pokemonSeleccionado = null;
								apodoNuevo = '';
								modalCrearIntegrante = true;
							}}
							class="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/40 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer group min-h-[300px]"
						>
							<div
								class="w-16 h-16 rounded-2xl bg-white group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-xs border border-slate-200 group-hover:border-transparent group-hover:scale-110"
							>
								<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"
									></path>
								</svg>
							</div>
							<div>
								<h4
									class="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors"
								>
									Añadir Integrante #{data.equipo.integrantes.length + 1}
								</h4>
								<p class="text-xs text-slate-500 max-w-xs mt-1">
									Completa tu alineación de 6 Pokémon para desbloquear el máximo potencial
									competitivo.
								</p>
							</div>
						</button>
					{/if}
				</div>
			{:else}
				<!-- VISTA DE TABLA MODERNA COMPARATIVA -->
				<div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm border-collapse">
							<thead>
								<tr
									class="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider"
								>
									<th class="p-4 text-center">#</th>
									<th class="p-4">Pokémon</th>
									<th class="p-4">Apodo</th>
									<th class="p-4">Tipos</th>
									<th class="p-4">Movimientos</th>
									<th class="p-4 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each data.equipo.integrantes as integrante, index}
									<tr class="hover:bg-slate-50/80 transition-colors">
										<td class="p-4 text-center font-bold text-slate-400 font-mono text-xs">
											{index + 1}
										</td>

										<td class="p-4">
											<div class="flex items-center gap-3">
												<a href="/pokemones/{integrante.pokemon.id}" class="shrink-0">
													<img
														src={integrante.pokemon.imagen}
														alt={integrante.pokemon.nombre}
														class="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 hover:scale-110 transition-transform"
													/>
												</a>
												<div>
													<a
														href="/pokemones/{integrante.pokemon.id}"
														class="font-bold text-slate-800 hover:text-blue-600 capitalize text-sm block"
													>
														{integrante.pokemon.nombre}
													</a>
													<span class="text-xs text-slate-400 font-mono">
														#{String(integrante.pokemon.id).padStart(3, '0')}
													</span>
												</div>
											</div>
										</td>

										<td class="p-4 font-semibold text-slate-800">
											<div class="flex items-center gap-1.5">
												<span>{integrante.apodo}</span>
												<button
													type="button"
													onclick={() => abrirModalEditarApodo(integrante)}
													class="text-slate-400 hover:text-blue-600 p-1"
													title="Editar apodo"
												>
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
															d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
														></path>
													</svg>
												</button>
											</div>
										</td>

										<td class="p-4">
											<div class="flex flex-wrap gap-1">
												{#each integrante.pokemon.tipos as t}
													<EtiquetaTipo tipo={t.nombre} tamaño="sm" />
												{/each}
											</div>
										</td>

										<td class="p-4">
											<div class="flex flex-wrap gap-1.5 items-center">
												{#if integrante.movimientos && integrante.movimientos.length > 0}
													{#each integrante.movimientos as mov}
														<a
															href="/movimientos/{mov.id}"
															class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
														>
															<span>{mov.nombre}</span>
															{#if mov.tipo}
																<span class="text-[10px] text-slate-400">({mov.tipo.nombre})</span>
															{/if}
														</a>
													{/each}
												{:else}
													<span class="text-xs text-slate-400 italic">Sin movimientos</span>
												{/if}

												{#if !integrante.movimientos || integrante.movimientos.length < 4}
													<button
														type="button"
														onclick={() => abrirModalMovimiento(integrante)}
														class="text-xs text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
													>
														+ Añadir
													</button>
												{/if}
											</div>
										</td>

										<td class="p-4 text-right">
											<div class="inline-flex items-center gap-1">
												<button
													type="button"
													onclick={() => abrirModalMovimiento(integrante)}
													title="Aprender movimiento"
													class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
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
															d="M12 4v16m8-8H4"
														></path>
													</svg>
												</button>

												<form
													action="?/eliminar_integrante"
													method="POST"
													use:enhance
													onsubmit={(e) => {
														if (!confirmarEliminarIntegrante(integrante.apodo)) {
															e.preventDefault();
														}
													}}
												>
													<input type="hidden" name="id_equipo" value={data.equipo.id} />
													<input type="hidden" name="integrante_id" value={integrante.id} />
													<button
														type="submit"
														title="Eliminar integrante"
														class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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
		{:else}
			<!-- ESTADO VACÍO: EL EQUIPO NO TIENE NINGÚN INTEGRANTE -->
			<div
				class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm"
			>
				<div
					class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl"
				>
					🛡️
				</div>
				<h3 class="text-xl font-bold text-slate-800">Aún no hay Pokémon en este equipo</h3>
				<p class="text-sm text-slate-600">
					Comienza agregando tu primer integrante. Podrás personalizar su apodo y enseñarle hasta 4
					movimientos de combate.
				</p>
				<button
					type="button"
					onclick={() => {
						pokemonSeleccionado = null;
						apodoNuevo = '';
						modalCrearIntegrante = true;
					}}
					class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					<span>Añadir Primer Pokémon</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- ========================================== -->
<!-- MODALES INTERACTIVOS Y FORMULARIOS MODERNOS -->
<!-- ========================================== -->

<!-- MODAL 1: EDITAR EQUIPO -->
{#if modalEditarEquipo}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
	>
		<div
			class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 animate-scale-up"
		>
			<div class="flex items-center justify-between border-b border-slate-100 pb-4">
				<h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						></path>
					</svg>
					Editar Información del Equipo
				</h3>
				<button
					type="button"
					onclick={() => (modalEditarEquipo = false)}
					class="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
				>
					&times;
				</button>
			</div>

			<form
				action="?/actualizar_equipo"
				method="POST"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							modalEditarEquipo = false;
							mensajeExito = 'Equipo actualizado exitosamente.';
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id_equipo" value={data.equipo.id} />

				<div class="space-y-1.5">
					<label
						for="nombre-equipo"
						class="text-xs font-bold uppercase tracking-wider text-slate-600"
					>
						Nombre del equipo
					</label>
					<input
						id="nombre-equipo"
						type="text"
						name="nombre"
						value={data.equipo.nombre}
						required
						maxlength="100"
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="generacion" class="text-xs font-bold uppercase tracking-wider text-slate-600">
						Generación Máxima Permitida
					</label>
					<select
						id="generacion"
						name="id_generacion"
						value={data.equipo.generacion?.id || ''}
						required
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as gen}
							<option value={gen}>Generación {gen}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
					<button
						type="button"
						onclick={() => (modalEditarEquipo = false)}
						class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
					>
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 2: CREAR / AÑADIR INTEGRANTE -->
{#if modalCrearIntegrante}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
	>
		<div
			class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 animate-scale-up"
		>
			<div class="flex items-center justify-between border-b border-slate-100 pb-4">
				<h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Añadir Integrante al Equipo
				</h3>
				<button
					type="button"
					onclick={() => (modalCrearIntegrante = false)}
					class="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
				>
					&times;
				</button>
			</div>

			<form
				action="?/agregar_integrante"
				method="POST"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							modalCrearIntegrante = false;
							pokemonSeleccionado = null;
							apodoNuevo = '';
							mensajeExito = '¡Integrante añadido al equipo con éxito!';
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id_equipo" value={data.equipo.id} />
				<input type="hidden" name="id_pokemon" value={pokemonSeleccionado?.id || ''} />

				<!-- Campo de Autocompletado Typeahead -->
				<div class="space-y-1.5">
					<label
						for="buscar-pokemon"
						class="text-xs font-bold uppercase tracking-wider text-slate-600"
					>
						Buscar Especie de Pokémon <span class="text-rose-500">*</span>
					</label>
					<Typeahead
						endpoint="{API_URL}/pokemon"
						placeholder="Escribe el nombre: Pikachu, Charizard..."
						onselect={(res) => {
							pokemonSeleccionado = res;
							if (!apodoNuevo) apodoNuevo = res.nombre;
						}}
					/>
				</div>

				<!-- Previsualización del Pokémon seleccionado -->
				{#if pokemonSeleccionado}
					<div
						class="flex items-center gap-3 p-3 bg-blue-50/70 border border-blue-200 rounded-2xl animate-fade-in"
					>
						{#if pokemonSeleccionado.imagen}
							<img
								src={pokemonSeleccionado.imagen}
								alt={pokemonSeleccionado.nombre}
								class="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-blue-100"
							/>
						{/if}
						<div>
							<h5 class="text-sm font-bold text-slate-800 capitalize">
								{pokemonSeleccionado.nombre}
							</h5>
							<p class="text-xs text-slate-500 font-mono">
								ID #{pokemonSeleccionado.id}
							</p>
						</div>
					</div>
				{/if}

				<!-- Apodo -->
				<div class="space-y-1.5">
					<label
						for="apodo-input"
						class="text-xs font-bold uppercase tracking-wider text-slate-600"
					>
						Apodo del Integrante <span class="text-rose-500">*</span>
					</label>
					<input
						id="apodo-input"
						type="text"
						name="apodo"
						bind:value={apodoNuevo}
						placeholder="Ej: Rayo Veloz"
						required
						maxlength="50"
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
					<button
						type="button"
						onclick={() => (modalCrearIntegrante = false)}
						class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={!pokemonSeleccionado || !apodoNuevo.trim()}
						class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
					>
						Añadir al Equipo
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 3: AGREGAR MOVIMIENTO -->
{#if modalAgregarMovimiento && integranteSeleccionadoParaMov}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
	>
		<div
			class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 animate-scale-up"
		>
			<div class="flex items-center justify-between border-b border-slate-100 pb-4">
				<div>
					<h3 class="text-lg font-bold text-slate-900">Aprender Movimiento</h3>
					<p class="text-xs text-slate-500">
						Para <span class="font-bold text-slate-800">{integranteSeleccionadoParaMov.apodo}</span>
						({integranteSeleccionadoParaMov.pokemon.nombre})
					</p>
				</div>
				<button
					type="button"
					onclick={() => (modalAgregarMovimiento = false)}
					class="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
				>
					&times;
				</button>
			</div>

			<form
				action="?/agregar_movimiento"
				method="POST"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							modalAgregarMovimiento = false;
							movimientoSeleccionado = null;
							mensajeExito = '¡Movimiento aprendido con éxito!';
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id_equipo" value={data.equipo.id} />
				<input type="hidden" name="id_integrante" value={integranteSeleccionadoParaMov.id} />
				<input type="hidden" name="id_movimiento" value={movimientoSeleccionado?.id || ''} />

				<!-- Typeahead para buscar movimiento -->
				<div class="space-y-1.5">
					<label
						for="buscar-movimiento"
						class="text-xs font-bold uppercase tracking-wider text-slate-600"
					>
						Buscar Movimiento <span class="text-rose-500">*</span>
					</label>
					<Typeahead
						endpoint="{API_URL}/movimientos"
						placeholder="Ej: Lanzallamas, Rayo, Terremoto..."
						onselect={(res) => {
							movimientoSeleccionado = res;
						}}
					/>
				</div>

				<!-- Previsualización del Movimiento seleccionado -->
				{#if movimientoSeleccionado}
					<div
						class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2 animate-fade-in"
					>
						<div class="flex items-center justify-between gap-2">
							<span class="font-bold text-slate-900 text-sm">
								{movimientoSeleccionado.nombre}
							</span>
							{#if movimientoSeleccionado.tipo}
								<EtiquetaTipo
									tipo={movimientoSeleccionado.tipo.nombre || movimientoSeleccionado.tipo}
									tamaño="sm"
								/>
							{/if}
						</div>
						<div class="flex items-center gap-3 text-xs text-slate-600 font-mono">
							<span>Potencia: {movimientoSeleccionado.potencia || '—'}</span>
							<span>
								Precisión: {movimientoSeleccionado.precision
									? `${movimientoSeleccionado.precision}%`
									: '—'}
							</span>
							<span>PP: {movimientoSeleccionado.puntos_de_poder || '—'}</span>
						</div>
					</div>
				{/if}

				<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
					<button
						type="button"
						onclick={() => (modalAgregarMovimiento = false)}
						class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={!movimientoSeleccionado}
						class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
					>
						Aprender
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 4: EDITAR APODO DEL INTEGRANTE -->
{#if modalEditarIntegrante && integranteParaEditar}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
	>
		<div
			class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 animate-scale-up"
		>
			<div class="flex items-center justify-between border-b border-slate-100 pb-4">
				<h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
						></path>
					</svg>
					Modificar Apodo
				</h3>
				<button
					type="button"
					onclick={() => (modalEditarIntegrante = false)}
					class="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
				>
					&times;
				</button>
			</div>

			<form
				action="?/editar_integrante"
				method="POST"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							modalEditarIntegrante = false;
							mensajeExito = '¡Apodo actualizado exitosamente!';
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id_equipo" value={data.equipo.id} />
				<input type="hidden" name="id_integrante" value={integranteParaEditar.id} />

				<div class="space-y-1.5">
					<label
						for="nuevo-apodo"
						class="text-xs font-bold uppercase tracking-wider text-slate-600"
					>
						Nuevo Apodo para {integranteParaEditar.pokemon.nombre}
					</label>
					<input
						id="nuevo-apodo"
						type="text"
						name="apodo"
						bind:value={nuevoApodo}
						required
						maxlength="50"
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
					<button
						type="button"
						onclick={() => (modalEditarIntegrante = false)}
						class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={!nuevoApodo.trim()}
						class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
					>
						Guardar Apodo
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
