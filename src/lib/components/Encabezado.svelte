<script>
	import { page } from '$app/state';
	import { buscarPokemon } from '#lib/helpers/busqueda.js';

	let menuCelular = $state(false);
	let textoBusqueda = $state('');

	const navegacion = [
		{
			nombre: 'Inicio',
			enlace: '/',
			icono: 'inicio'
		},
		{
			nombre: 'Pokémon',
			enlace: '/pokemones',
			icono: 'pokemon'
		},
		{
			nombre: 'Movimientos',
			enlace: '/movimientos',
			icono: 'movimientos'
		},
		{
			nombre: 'Equipos',
			enlace: '/equipos',
			icono: 'equipos'
		}
	];

	function estaActivo(enlace) {
		const ruta = page.url.pathname;
		if (enlace === '/') {
			return ruta === '/';
		}
		return ruta.startsWith(enlace);
	}

	function realizarBusqueda() {
		if (textoBusqueda.trim()) {
			buscarPokemon(textoBusqueda);
			menuCelular = false;
		}
	}

	function manejarEnter(event) {
		if (event.key === 'Enter') {
			realizarBusqueda();
		}
	}
</script>

<header
	class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<nav class="flex items-center justify-between h-16 gap-4">
			<!-- LOGO Y MARCA -->
			<div class="flex items-center gap-3 shrink-0">
				<a
					href="/"
					class="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
				>
					<div
						class="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:rotate-12 transition-transform duration-300"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1333.34 1333.07"
							class="w-5 h-5 text-white"
						>
							<g id="Layer_x0020_1">
								<g id="_1473324886368">
									<path
										d="M666.54 885.24c-105.31 0-193.15-74.56-214.01-173.61H102.19c24.77 288.04 266.41 514.04 560.7 514.04 294.3 0 536.2-226 560.7-514.04H880.55c-20.85 99.32-108.7 173.61-214.01 173.61z"
										fill="#ffffff"
									/>
									<path
										d="M795.57 666.54c-.26 0-.26 0 0 0-.26-15.9-3.13-31.02-8.34-45.09-18.25-49.01-65.43-83.68-120.69-83.68-55.26 0-102.44 34.93-120.69 83.68a129.312 129.312 0 00-8.08 45.09h.26c0 15.9 2.87 31.02 8.08 45.09 18.25 49.01 65.43 83.68 120.69 83.68 55.26 0 102.44-34.93 120.69-83.68 5.21-13.82 8.08-29.19 8.08-45.09z"
										fill="#ffffff"
									/>
									<path
										d="M666.8 448.09c105.31 0 193.15 74.56 214.01 173.61h350.34c-24.76-288.3-266.41-514.3-560.96-514.3-294.56 0-535.94 226-560.7 514.04h343.3c20.85-99.06 108.7-173.35 214.01-173.35z"
										fill="#ff2d55"
									/>
									<path
										d="M670.19 107.4c294.56 0 536.2 226 560.7 514.04H880.55c-20.85-99.06-108.7-173.61-214.02-173.61-105.31 0-193.15 74.56-214.01 173.61H109.48c24.76-288.05 266.41-514.04 560.7-514.04zm117.04 514.04c5.21 14.07 8.08 29.19 8.08 45.09h.26c0 15.9-2.87 31.02-8.08 45.09-18.24 49.01-65.43 83.68-120.69 83.68-55.26 0-102.44-34.93-120.69-83.68a129.312 129.312 0 01-8.08-45.09h-.26c0-15.9 2.87-31.02 8.08-45.09 18.24-49.01 65.43-83.68 120.69-83.68 55.26 0 102.44 34.93 120.69 83.68z"
										fill="#1e293b"
									/>
								</g>
							</g>
						</svg>
					</div>

					<div class="flex flex-col">
						<span class="text-xl font-black tracking-tight text-slate-900 leading-none">
							Intro<span class="text-blue-600">Dex</span>
						</span>
						<span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
							FIUBA &bull; IDS
						</span>
					</div>
				</a>
			</div>

			<!-- NAVEGACIÓN EN ESCRITORIO CON INDICADORES ACTIVOS -->
			<div
				class="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs"
			>
				{#each navegacion as item}
					{@const activo = estaActivo(item.enlace)}
					<a
						href={item.enlace}
						class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 {activo
							? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-bold'
							: 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}"
					>
						{#if item.icono === 'inicio'}
							<svg
								class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								></path>
							</svg>
						{:else if item.icono === 'pokemon'}
							<svg
								class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<circle cx="12" cy="12" r="9" stroke-width="2"></circle>
								<circle cx="12" cy="12" r="3" stroke-width="2"></circle>
								<line x1="3" y1="12" x2="9" y2="12" stroke-width="2"></line>
								<line x1="15" y1="12" x2="21" y2="12" stroke-width="2"></line>
							</svg>
						{:else if item.icono === 'movimientos'}
							<svg
								class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
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
						{:else if item.icono === 'equipos'}
							<svg
								class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								></path>
							</svg>
						{/if}
						<span>{item.nombre}</span>
					</a>
				{/each}
			</div>

			<!-- BARRA DE BÚSQUEDA GLOBAL RÁPIDA -->
			<div class="hidden sm:flex items-center relative max-w-xs w-full">
				<div class="relative w-full">
					<input
						type="text"
						placeholder="Buscar especie..."
						class="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/90 focus:bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-2xs"
						bind:value={textoBusqueda}
						onkeydown={manejarEnter}
					/>
					<svg
						class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
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

					{#if textoBusqueda}
						<button
							type="button"
							onclick={() => (textoBusqueda = '')}
							class="absolute right-8 top-2 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
						>
							&times;
						</button>
					{/if}

					<button
						type="button"
						onclick={realizarBusqueda}
						title="Ejecutar búsqueda"
						class="absolute right-1.5 top-1.5 p-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer shadow-xs"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- BOTÓN HAMBURGUESA MÓVIL ANIMADO -->
			<button
				type="button"
				class="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
				onclick={() => (menuCelular = !menuCelular)}
				aria-label="Abrir menú de navegación"
				aria-expanded={menuCelular}
			>
				{#if menuCelular}
					<!-- Icono de Cierre (X) -->
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				{:else}
					<!-- Icono de Hamburguesa -->
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				{/if}
			</button>
		</nav>

		<!-- MENÚ DESPLEGABLE MÓVIL -->
		{#if menuCelular}
			<div
				class="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-md space-y-3 animate-fade-in"
			>
				<div class="space-y-1">
					{#each navegacion as item}
						{@const activo = estaActivo(item.enlace)}
						<a
							href={item.enlace}
							class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors {activo
								? 'bg-blue-50 text-blue-600 font-bold'
								: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
							onclick={() => (menuCelular = false)}
						>
							{#if item.icono === 'inicio'}
								<svg
									class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									></path>
								</svg>
							{:else if item.icono === 'pokemon'}
								<svg
									class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<circle cx="12" cy="12" r="9" stroke-width="2"></circle>
									<circle cx="12" cy="12" r="3" stroke-width="2"></circle>
									<line x1="3" y1="12" x2="9" y2="12" stroke-width="2"></line>
									<line x1="15" y1="12" x2="21" y2="12" stroke-width="2"></line>
								</svg>
							{:else if item.icono === 'movimientos'}
								<svg
									class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
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
							{:else if item.icono === 'equipos'}
								<svg
									class="w-4 h-4 {activo ? 'text-blue-600' : 'text-slate-400'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									></path>
								</svg>
							{/if}
							<span>{item.nombre}</span>
						</a>
					{/each}
				</div>

				<!-- Barra de búsqueda móvil -->
				<div class="px-2 pt-2 border-t border-slate-100">
					<div class="relative">
						<input
							type="text"
							placeholder="Buscar Pokémon..."
							class="w-full pl-9 pr-10 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
							bind:value={textoBusqueda}
							onkeydown={manejarEnter}
						/>
						<svg
							class="w-4 h-4 text-slate-400 absolute left-3 top-3"
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
						<button
							type="button"
							onclick={realizarBusqueda}
							class="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg cursor-pointer"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</header>
