<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import TarjetaPokemon from '#lib/components/TarjetaPokemon.svelte';
	import { NOMBRES_TIPOS } from '#lib/constantes';
	import './page.css';

	let { data } = $props();

	let terminoBusqueda = $state('');
	let tipoSeleccionado = $state('');
	let vistaModo = $state('cuadricula'); // 'cuadricula' | 'tabla'

	$effect(() => {
		terminoBusqueda = page.url.searchParams.get('nombre') || '';
		tipoSeleccionado = page.url.searchParams.get('tipo') || '';
	});

	const limpiarFiltros = () => {
		terminoBusqueda = '';
		tipoSeleccionado = '';
		const formElement = document.getElementById('form-filtrar-pokemon');
		if (formElement) formElement.reset();
		goto('/pokemones?page=0');
	};
</script>

<svelte:head>
	<title>Explorar Pokémon - IntroDex</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto space-y-8">
		<!-- Breadcrumbs y Título -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
					<a href="/" class="hover:text-blue-600 transition-colors">Inicio</a>
					<span>&bull;</span>
					<span class="text-slate-800 font-medium">Pokémon</span>
				</nav>
				<h1
					class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3"
				>
					<span>Explorar Pokémon</span>
				</h1>
				<p class="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
					Consulta estadísticas, tipos y detalles de todas las especies disponibles en la Pokédex.
				</p>
			</div>

			<a
				href="/"
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-100 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
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

		<!-- PANEL DE BÚSQUEDA Y FILTROS -->
		<div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
			<div class="flex items-center justify-between border-b border-slate-100 pb-4">
				<h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						></path>
					</svg>
					Filtros de Búsqueda
				</h2>

				{#if terminoBusqueda || tipoSeleccionado}
					<button
						onclick={limpiarFiltros}
						type="button"
						class="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
					>
						Limpiar filtros
					</button>
				{/if}
			</div>

			<form method="GET" action="/pokemones" id="form-filtrar-pokemon" class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
					<!-- Campo de texto: Nombre -->
					<div class="md:col-span-6 space-y-1.5">
						<label for="search" class="text-xs font-bold uppercase tracking-wider text-slate-500">
							Buscar por Nombre
						</label>
						<div class="relative">
							<input
								id="search"
								name="nombre"
								bind:value={terminoBusqueda}
								type="text"
								placeholder="Ej: Pikachu, Charizard, Gengar..."
								class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
					</div>

					<!-- Filtro por tipo -->
					<div class="md:col-span-4 space-y-1.5">
						<label for="type" class="text-xs font-bold uppercase tracking-wider text-slate-500">
							Tipo Elemental
						</label>
						<select
							id="type"
							name="tipo"
							bind:value={tipoSeleccionado}
							class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
						>
							<option value="">Todos los tipos</option>
							{#each NOMBRES_TIPOS as tipo}
								<option value={tipo.toLowerCase()}>{tipo}</option>
							{/each}
						</select>
					</div>

					<!-- Botón de envío -->
					<div class="md:col-span-2">
						<button
							type="submit"
							class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
							<span>Filtrar</span>
						</button>
					</div>
				</div>
			</form>

			<!-- Filtros activos (Chips) -->
			{#if terminoBusqueda || tipoSeleccionado}
				<div class="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 text-xs">
					<span class="font-semibold text-slate-500">Filtros activos:</span>
					{#if terminoBusqueda}
						<span
							class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium"
						>
							Nombre: "{terminoBusqueda}"
							<button
								type="button"
								onclick={() => (terminoBusqueda = '')}
								class="hover:text-blue-900 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
							>
								&times;
							</button>
						</span>
					{/if}
					{#if tipoSeleccionado}
						<span
							class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full"
						>
							<EtiquetaTipo tipo={tipoSeleccionado} tamaño="sm" />
							<button
								type="button"
								onclick={() => (tipoSeleccionado = '')}
								class="hover:text-slate-900 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
							>
								&times;
							</button>
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- BARRA DE RESULTADOS & VISTA TOGGLE -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-slate-800">
					Resultados <span class="text-sm font-normal text-slate-500">
						({data.pokemones.length} en esta página)
					</span>
				</span>

				<!-- Switch vista Cuadrícula / Tabla -->
				<div class="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
					<button
						onclick={() => (vistaModo = 'cuadricula')}
						title="Vista en cuadrícula"
						class="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {vistaModo ===
						'cuadricula'
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

			<!-- Paginación superior -->
			<Pagination currentPage={data.currentPage} hasMore={data.hasMore} pageSize={data.pageSize} />
		</div>

		<!-- LISTADO DE POKÉMON -->
		{#if data.pokemones && data.pokemones.length > 0}
			{#if vistaModo === 'cuadricula'}
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{#each data.pokemones as pokemon}
						<TarjetaPokemon {pokemon} />
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
									<th class="p-4 text-center w-24">Imagen</th>
									<th class="p-4">N.º</th>
									<th class="p-4">Nombre</th>
									<th class="p-4">Tipos</th>
									<th class="p-4 text-center">Altura</th>
									<th class="p-4 text-center">Peso</th>
									<th class="p-4 text-right">Acción</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each data.pokemones as pokemon}
									<tr class="hover:bg-slate-50/80 transition-colors">
										<td class="p-3 text-center">
											<img
												src={pokemon.imagen}
												alt={pokemon.nombre}
												class="w-14 h-14 object-contain mx-auto"
												loading="lazy"
											/>
										</td>
										<td class="p-4 font-mono text-xs font-semibold text-slate-400">
											#{pokemon.id ? pokemon.id.toString().padStart(3, '0') : '???'}
										</td>
										<td class="p-4 font-bold text-slate-800 capitalize text-base">
											{pokemon.nombre}
										</td>
										<td class="p-4">
											<div class="flex flex-wrap gap-1">
												{#each pokemon.tipos || [] as tipo}
													<EtiquetaTipo tipo={tipo.nombre || tipo} tamaño="sm" />
												{/each}
											</div>
										</td>
										<td class="p-4 text-center font-mono text-slate-600">
											{pokemon.altura || '—'} m
										</td>
										<td class="p-4 text-center font-mono text-slate-600">
											{pokemon.peso || '—'} kg
										</td>
										<td class="p-4 text-right">
											<a
												href={`/pokemones/${pokemon.id}`}
												class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-medium text-xs transition-colors cursor-pointer"
											>
												<span>Ver detalle</span>
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
				</div>
			{/if}

			<!-- Paginación Inferior -->
			<div class="flex justify-center pt-4">
				<Pagination
					currentPage={data.currentPage}
					hasMore={data.hasMore}
					pageSize={data.pageSize}
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
					🔍
				</div>
				<h3 class="text-xl font-bold text-slate-800">No se encontraron Pokémon</h3>
				<p class="text-sm text-slate-600">
					No hay resultados que coincidan con los filtros aplicados. Intenta con otro término o
					limpia los filtros para ver todas las especies.
				</p>
				<button
					onclick={limpiarFiltros}
					class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
				>
					Restablecer filtros
				</button>
			</div>
		{/if}
	</div>
</div>
