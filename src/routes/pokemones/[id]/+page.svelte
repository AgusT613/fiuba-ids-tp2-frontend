<script>
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';

	let { data } = $props();

	let pokemon = $derived(data.pokemon);
	let estadisticas = $derived(pokemon?.estadisticas || {});

	let tabMovimientos = $state('nivel'); // 'nivel' | 'maquina' | 'huevo'
	let busquedaMovimiento = $state('');

	// Stats helpers
	let statsList = $derived([
		{
			clave: 'HP',
			etiqueta: 'Puntos de Golpe',
			valor: estadisticas.puntos_de_golpe || 0,
			color: 'bg-emerald-500',
			bgColor: 'bg-emerald-100',
			textColor: 'text-emerald-700'
		},
		{
			clave: 'ATQ',
			etiqueta: 'Ataque',
			valor: estadisticas.ataque || 0,
			color: 'bg-rose-500',
			bgColor: 'bg-rose-100',
			textColor: 'text-rose-700'
		},
		{
			clave: 'DEF',
			etiqueta: 'Defensa',
			valor: estadisticas.defensa || 0,
			color: 'bg-blue-500',
			bgColor: 'bg-blue-100',
			textColor: 'text-blue-700'
		},
		{
			clave: 'ATQ. ESP',
			etiqueta: 'Ataque Especial',
			valor: estadisticas.ataque_especial || 0,
			color: 'bg-purple-500',
			bgColor: 'bg-purple-100',
			textColor: 'text-purple-700'
		},
		{
			clave: 'DEF. ESP',
			etiqueta: 'Defensa Especial',
			valor: estadisticas.defensa_especial || 0,
			color: 'bg-teal-500',
			bgColor: 'bg-teal-100',
			textColor: 'text-teal-700'
		},
		{
			clave: 'VEL',
			etiqueta: 'Velocidad',
			valor: estadisticas.velocidad || 0,
			color: 'bg-amber-500',
			bgColor: 'bg-amber-100',
			textColor: 'text-amber-700'
		}
	]);

	let totalStats = $derived(
		(estadisticas.puntos_de_golpe || 0) +
			(estadisticas.ataque || 0) +
			(estadisticas.defensa || 0) +
			(estadisticas.ataque_especial || 0) +
			(estadisticas.defensa_especial || 0) +
			(estadisticas.velocidad || 0)
	);

	// Movimientos activos según tab
	let movimientosActuales = $derived(
		tabMovimientos === 'nivel'
			? pokemon.movimientos_nivel || []
			: tabMovimientos === 'maquina'
				? pokemon.movimientos_maquina || []
				: pokemon.movimientos_huevo || []
	);

	let movimientosFiltrados = $derived(
		movimientosActuales.filter((m) =>
			m.nombre.toLowerCase().includes(busquedaMovimiento.trim().toLowerCase())
		)
	);

	function categoriaColor(cat) {
		const c = (cat || '').toLowerCase();
		if (c === 'físico' || c === 'fisico') return 'bg-orange-100 text-orange-800 border-orange-200';
		if (c === 'especial') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
		return 'bg-slate-100 text-slate-700 border-slate-200';
	}
</script>

<svelte:head>
	<title>{pokemon.nombre} - IntroDex</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-6xl mx-auto space-y-8">
		<!-- Navegación superior / Breadcrumb -->
		<div class="flex items-center justify-between">
			<a
				href="/pokemones"
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
				Volver a Pokémon
			</a>

			<span class="text-sm text-slate-500 hidden sm:inline-block">
				IntroDex &bull; Detalle de Pokémon
			</span>
		</div>

		<!-- HERO CARD: Imagen, Nombre, Tipos y Medidas -->
		<div class="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
			<div class="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
				<!-- Imagen con fondo estilizado -->
				<div class="md:col-span-5 flex flex-col items-center justify-center">
					<div
						class="relative w-full max-w-xs aspect-square rounded-3xl bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50 flex items-center justify-center p-6 border border-slate-200/80 shadow-inner group"
					>
						<span
							class="absolute top-4 left-4 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 border border-slate-200 shadow-sm"
						>
							#{pokemon.id ? pokemon.id.toString().padStart(3, '0') : '???'}
						</span>
						<img
							src={pokemon.imagen}
							alt={pokemon.nombre}
							class="w-56 h-56 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				</div>

				<!-- Datos principales -->
				<div class="md:col-span-7 space-y-6">
					<div>
						<div class="flex flex-wrap items-center gap-2 mb-3">
							{#each pokemon.tipos as tipo}
								<EtiquetaTipo tipo={tipo.nombre} tamaño="md" />
							{/each}
						</div>
						<h1
							class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight capitalize"
						>
							{pokemon.nombre}
						</h1>
					</div>

					<!-- Medidas físicas (Altura / Peso) -->
					<div class="grid grid-cols-2 gap-4">
						<div
							class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4"
						>
							<div
								class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									></path>
								</svg>
							</div>
							<div>
								<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
									Altura
								</span>
								<p class="text-xl font-bold text-slate-800">
									{pokemon.altura} <span class="text-sm font-normal text-slate-500">m</span>
								</p>
							</div>
						</div>

						<div
							class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4"
						>
							<div
								class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
									></path>
								</svg>
							</div>
							<div>
								<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
									Peso
								</span>
								<p class="text-xl font-bold text-slate-800">
									{pokemon.peso} <span class="text-sm font-normal text-slate-500">kg</span>
								</p>
							</div>
						</div>
					</div>

					<!-- Generaciones y Habilidades -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<!-- Generaciones -->
						<div class="space-y-2">
							<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
								Generaciones
							</span>
							<div class="flex flex-wrap gap-2">
								{#each pokemon.generaciones as gen}
									<span
										class="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
									>
										{gen.nombre}
									</span>
								{/each}
							</div>
						</div>

						<!-- Habilidades -->
						<div class="space-y-2">
							<span class="text-xs uppercase tracking-wider font-semibold text-slate-400">
								Habilidades
							</span>
							<div class="flex flex-wrap gap-2">
								{#each pokemon.habilidades as hab}
									<span
										class="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg capitalize"
									>
										{hab.nombre}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- GRID: Estadísticas Base & Tipos/Debilidades -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
			<!-- Estadísticas Base (7 cols) -->
			<div
				class="lg:col-span-7 bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6"
			>
				<div class="flex items-center justify-between border-b border-slate-100 pb-4">
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
						Estadísticas Base
					</h2>
					<span
						class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
					>
						Total: {totalStats}
					</span>
				</div>

				<div class="space-y-4">
					{#each statsList as stat}
						<div>
							<div class="flex items-center justify-between text-sm mb-1.5">
								<span class="font-medium text-slate-700">{stat.etiqueta}</span>
								<span class="font-bold font-mono text-slate-900">{stat.valor}</span>
							</div>
							<div
								class="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60"
							>
								<div
									class="h-full rounded-full {stat.color} transition-all duration-700 ease-out"
									style="width: {Math.min(100, Math.max(5, (stat.valor / 255) * 100))}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Tipos y Debilidades (5 cols) -->
			<div
				class="lg:col-span-5 bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6"
			>
				<div class="border-b border-slate-100 pb-4">
					<h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
						<svg
							class="w-5 h-5 text-amber-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
						Tipos y Debilidades
					</h2>
				</div>

				<div class="space-y-6">
					{#each pokemon.tipos as tipo}
						<div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold uppercase tracking-wider text-slate-400">Tipo</span>
								<EtiquetaTipo tipo={tipo.nombre} tamaño="sm" />
							</div>

							<div>
								<span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
									Debilidades
								</span>
								<div class="flex flex-wrap gap-1.5">
									{#if tipo.debilidades && tipo.debilidades.length > 0}
										{#each tipo.debilidades as deb}
											<EtiquetaTipo tipo={deb.nombre} tamaño="sm" />
										{/each}
									{:else}
										<span class="text-xs text-slate-500 italic">Sin debilidades registradas</span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- EVOLUCIONES: Cadena visual -->
		<div class="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
			<div class="border-b border-slate-100 pb-4">
				<h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
					<svg
						class="w-5 h-5 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						></path>
					</svg>
					Línea Evolutiva
				</h2>
			</div>

			{#if pokemon.evoluciones && pokemon.evoluciones.length > 0}
				<div class="flex flex-wrap items-center justify-center gap-6 py-4">
					{#each pokemon.evoluciones as evo, index}
						{#if index > 0}
							<div class="text-slate-300 hidden sm:block">
								<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									></path>
								</svg>
							</div>
						{/if}

						<a
							href={`/pokemones/${evo.id}`}
							class="group flex flex-col items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md min-w-[140px]"
						>
							<div
								class="w-24 h-24 rounded-xl bg-white flex items-center justify-center p-2 mb-3 border border-slate-200/60 shadow-inner group-hover:scale-105 transition-transform"
							>
								<img src={evo.imagen} alt={evo.nombre} class="max-h-20 max-w-full object-contain" />
							</div>
							<span
								class="font-bold text-slate-800 capitalize text-sm group-hover:text-blue-600 transition-colors"
							>
								{evo.nombre}
							</span>
							<span class="text-xs text-slate-400 mt-1 font-mono">
								#{evo.id.toString().padStart(3, '0')}
							</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="py-12 text-center text-slate-400">
					<p class="text-sm font-medium">Este Pokémon no cuenta con evoluciones registradas.</p>
				</div>
			{/if}
		</div>

		<!-- MOVIMIENTOS: Pestañas + Búsqueda + Tabla interactiva -->
		<div class="bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6">
			<div
				class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4"
			>
				<h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						></path>
					</svg>
					Movimientos Disponibles
				</h2>

				<!-- Pestañas de categoría de movimiento -->
				<div
					class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto"
				>
					<button
						onclick={() => (tabMovimientos = 'nivel')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabMovimientos ===
						'nivel'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Nivel ({pokemon.movimientos_nivel?.length || 0})
					</button>
					<button
						onclick={() => (tabMovimientos = 'maquina')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabMovimientos ===
						'maquina'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Máquina ({pokemon.movimientos_maquina?.length || 0})
					</button>
					<button
						onclick={() => (tabMovimientos = 'huevo')}
						class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer {tabMovimientos ===
						'huevo'
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Por Huevo ({pokemon.movimientos_huevo?.length || 0})
					</button>
				</div>
			</div>

			<!-- Buscador de movimientos -->
			<div class="relative max-w-sm">
				<input
					type="text"
					bind:value={busquedaMovimiento}
					placeholder="Buscar movimiento..."
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

			<!-- Tabla de Movimientos -->
			<div class="overflow-x-auto rounded-2xl border border-slate-200">
				<table class="w-full text-left text-sm border-collapse">
					<thead>
						<tr
							class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200"
						>
							<th class="p-3.5 font-semibold">Movimiento</th>
							<th class="p-3.5 font-semibold">Tipo</th>
							<th class="p-3.5 font-semibold text-center">Categoría</th>
							<th class="p-3.5 font-semibold text-center">Potencia</th>
							<th class="p-3.5 font-semibold text-center">Precisión</th>
							<th class="p-3.5 font-semibold text-center">PP</th>
							<th class="p-3.5 font-semibold">Generación</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each movimientosFiltrados as mov}
							<tr class="hover:bg-slate-50/80 transition-colors">
								<td class="p-3.5">
									<a
										href={`/movimientos/${mov.id}`}
										class="font-bold text-slate-800 hover:text-blue-600 transition-colors capitalize inline-flex items-center gap-1.5"
									>
										{mov.nombre}
										<svg
											class="w-3.5 h-3.5 text-slate-400 opacity-0 hover:opacity-100 transition-opacity"
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
								<td class="p-3.5">
									<EtiquetaTipo tipo={mov.tipo.nombre} tamaño="sm" />
								</td>
								<td class="p-3.5 text-center">
									<span
										class="inline-block px-2 py-0.5 rounded text-xs font-semibold border {categoriaColor(
											mov.categoria
										)} capitalize"
									>
										{mov.categoria || '—'}
									</span>
								</td>
								<td class="p-3.5 text-center font-mono font-medium text-slate-700">
									{mov.potencia || '—'}
								</td>
								<td class="p-3.5 text-center font-mono font-medium text-slate-700">
									{mov.precision ? `${mov.precision}%` : '—'}
								</td>
								<td class="p-3.5 text-center font-mono font-medium text-slate-700">
									{mov.puntos_de_poder}
								</td>
								<td class="p-3.5 text-slate-500 text-xs">
									{mov.generacion.nombre}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="7" class="p-8 text-center text-slate-400">
									{#if busquedaMovimiento.trim()}
										No se encontraron movimientos que coincidan con "{busquedaMovimiento}".
									{:else}
										No hay movimientos registrados para esta categoría.
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
