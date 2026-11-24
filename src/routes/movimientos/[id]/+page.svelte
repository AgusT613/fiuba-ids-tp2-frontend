<script>
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';

	let { data } = $props();

	let movimiento = $derived(data.movimiento);

	let tabPokemon = $state('nivel'); // 'nivel' | 'maquina' | 'huevo'
	let busquedaPokemon = $state('');
	let vistaModo = $state('tarjetas'); // 'tarjetas' | 'tabla'

	let listaPokemonActual = $derived(
		tabPokemon === 'nivel'
			? movimiento.pokemon_por_nivel || []
			: tabPokemon === 'maquina'
				? movimiento.pokemon_por_maquina || []
				: movimiento.pokemon_por_huevo || []
	);

	let pokemonFiltrados = $derived(
		listaPokemonActual.filter((p) =>
			p.nombre.toLowerCase().includes(busquedaPokemon.trim().toLowerCase())
		)
	);

	function categoriaEstilo(cat) {
		const c = (cat || '').toLowerCase();
		if (c === 'físico' || c === 'fisico') {
			return {
				bg: 'bg-orange-50 text-orange-700 border-orange-200',
				icono: '⚔️'
			};
		}
		if (c === 'especial') {
			return {
				bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
				icono: '✨'
			};
		}
		return {
			bg: 'bg-slate-100 text-slate-700 border-slate-200',
			icono: '🛡️'
		};
	}
</script>

<svelte:head>
	<title>{movimiento.nombre} - IntroDex</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-6xl mx-auto space-y-8">
		<!-- Navegación superior / Breadcrumb -->
		<div class="flex items-center justify-between">
			<a
				href="/movimientos"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				Volver a Movimientos
			</a>

			<span class="text-sm text-slate-500 hidden sm:inline-block">
				IntroDex &bull; Detalle de Movimiento
			</span>
		</div>

		<!-- HERO CARD: Datos del Movimiento -->
		<div class="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-10 space-y-6">
			<!-- Encabezado con Nombre y Badges -->
			<div
				class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6"
			>
				<div>
					<div class="flex flex-wrap items-center gap-2.5 mb-2">
						<EtiquetaTipo tipo={movimiento.tipo.nombre} tamaño="md" />

						<span
							class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border capitalize {categoriaEstilo(
								movimiento.categoria
							).bg}"
						>
							<span>{categoriaEstilo(movimiento.categoria).icono}</span>
							{movimiento.categoria || 'Estado'}
						</span>

						<span
							class="px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 border border-slate-200"
						>
							{movimiento.generacion.nombre}
						</span>
					</div>

					<h1
						class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight capitalize"
					>
						{movimiento.nombre}
					</h1>
				</div>
			</div>

			<!-- Métricas de combate (Potencia, Precisión, PP) -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Potencia -->
				<div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>
					<div>
						<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
							Potencia
						</span>
						<p class="text-2xl font-black text-slate-800 font-mono">
							{movimiento.potencia || '—'}
						</p>
					</div>
				</div>

				<!-- Precisión -->
				<div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<div>
						<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
							Precisión
						</span>
						<p class="text-2xl font-black text-slate-800 font-mono">
							{movimiento.precision ? `${movimiento.precision}%` : '—'}
						</p>
					</div>
				</div>

				<!-- Puntos de Poder -->
				<div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
					</div>
					<div>
						<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
							Puntos de Poder (PP)
						</span>
						<p class="text-2xl font-black text-slate-800 font-mono">
							{movimiento.puntos_de_poder}
						</p>
					</div>
				</div>
			</div>

			<!-- Efecto / Descripción -->
			<div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 flex items-start gap-3.5">
				<div
					class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<div>
					<span class="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
						Efecto en Combate
					</span>
					<p class="text-slate-700 text-sm sm:text-base leading-relaxed">
						{movimiento.efecto ||
							'No se tiene descripción detallada del efecto de este movimiento.'}
					</p>
				</div>
			</div>
		</div>

		<!-- POKÉMON QUE APRENDEN EL MOVIMIENTO -->
		<div class="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
			<div
				class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4"
			>
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
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							></path>
						</svg>
						Pokémon que aprenden este movimiento
					</h2>
					<p class="text-xs text-slate-500 mt-1">
						Listado de especies según el método de aprendizaje
					</p>
				</div>

				<!-- Pestañas de método -->
				<div
					class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto"
				>
					<button
						onclick={() => (tabPokemon = 'nivel')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabPokemon ===
						'nivel'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Nivel ({movimiento.pokemon_por_nivel?.length || 0})
					</button>
					<button
						onclick={() => (tabPokemon = 'maquina')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabPokemon ===
						'maquina'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Máquina ({movimiento.pokemon_por_maquina?.length || 0})
					</button>
					<button
						onclick={() => (tabPokemon = 'huevo')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabPokemon ===
						'huevo'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Huevo ({movimiento.pokemon_por_huevo?.length || 0})
					</button>
				</div>
			</div>

			<!-- Barra de herramientas: Filtro por nombre y selector de vista -->
			<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
				<div class="relative max-w-sm flex-1">
					<input
						type="text"
						bind:value={busquedaPokemon}
						placeholder="Buscar Pokémon..."
						class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					<svg
						class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
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

				<!-- Switch vista Cuadrícula / Tabla -->
				<div
					class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-end sm:self-auto"
				>
					<button
						onclick={() => (vistaModo = 'tarjetas')}
						title="Vista en tarjetas"
						class="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {vistaModo ===
						'tarjetas'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-500 hover:text-slate-800'}"
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
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-500 hover:text-slate-800'}"
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

			<!-- Contenido: Tarjetas o Tabla -->
			{#if pokemonFiltrados.length > 0}
				{#if vistaModo === 'tarjetas'}
					<!-- Grid de Tarjetas -->
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{#each pokemonFiltrados as p}
							<a
								href={`/pokemones/${p.id}`}
								class="group bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
							>
								<div
									class="relative w-full aspect-square rounded-xl bg-white p-2 mb-2 flex items-center justify-center border border-slate-200/50 shadow-inner group-hover:scale-105 transition-transform"
								>
									<img src={p.imagen} alt={p.nombre} class="max-h-20 max-w-full object-contain" />
									<span
										class="absolute top-1.5 right-1.5 text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded"
									>
										#{p.id.toString().padStart(3, '0')}
									</span>
								</div>
								<h3
									class="font-bold text-slate-800 text-sm capitalize group-hover:text-blue-600 transition-colors line-clamp-1"
								>
									{p.nombre}
								</h3>
								<div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
									<span>{p.altura}m</span>
									<span>&bull;</span>
									<span>{p.peso}kg</span>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<!-- Tabla Compacta -->
					<div class="overflow-x-auto rounded-2xl border border-slate-200">
						<table class="w-full text-left text-sm border-collapse">
							<thead>
								<tr
									class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200"
								>
									<th class="p-3 text-center w-20">Foto</th>
									<th class="p-3">Nombre</th>
									<th class="p-3 text-center">Altura</th>
									<th class="p-3 text-center">Peso</th>
									<th class="p-3 text-right">Acción</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each pokemonFiltrados as p}
									<tr class="hover:bg-slate-50/80 transition-colors">
										<td class="p-2 text-center">
											<img src={p.imagen} alt={p.nombre} class="w-12 h-12 object-contain mx-auto" />
										</td>
										<td class="p-3">
											<span class="font-bold text-slate-800 capitalize">{p.nombre}</span>
											<span class="text-xs text-slate-400 block font-mono">
												#{p.id.toString().padStart(3, '0')}
											</span>
										</td>
										<td class="p-3 text-center text-slate-600">{p.altura} m</td>
										<td class="p-3 text-center text-slate-600">{p.peso} kg</td>
										<td class="p-3 text-right">
											<a
												href={`/pokemones/${p.id}`}
												class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
											>
												Ver detalle
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
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{:else}
				<div class="py-12 text-center text-slate-400">
					{#if busquedaPokemon.trim()}
						<p class="text-sm font-medium">
							No se encontraron Pokémon con el nombre "{busquedaPokemon}".
						</p>
					{:else}
						<p class="text-sm font-medium">
							No hay Pokémon registrados que aprendan este movimiento por este método.
						</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
