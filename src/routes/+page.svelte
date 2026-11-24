<script>
	import TarjetaPokemon from '#lib/components/TarjetaPokemon.svelte';
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';
	import { buscarPokemon } from '#lib/helpers/busqueda.js';

	let { data } = $props();

	let busquedaTexto = $state('');

	function manejarBusqueda(e) {
		e?.preventDefault();
		if (busquedaTexto.trim()) {
			buscarPokemon(busquedaTexto.trim());
		}
	}

	function buscarSugerido(nombre) {
		buscarPokemon(nombre);
	}

	const tiposDisponibles = [
		'fuego',
		'agua',
		'planta',
		'eléctrico',
		'hielo',
		'lucha',
		'veneno',
		'tierra',
		'volador',
		'psíquico',
		'bicho',
		'roca',
		'fantasma',
		'dragón',
		'siniestro',
		'acero',
		'hada',
		'normal'
	];

	const sugerenciasPopulares = ['Pikachu', 'Charizard', 'Gengar', 'Lucario', 'Mewtwo', 'Eevee'];

	const accionesRapidas = [
		{
			titulo: 'Catálogo de Pokémon',
			descripcion: 'Explora fichas completas, tipos, alturas, pesos y cadenas de evolución.',
			icono: '🔍',
			enlace: '/pokemones',
			badge: 'Explorar',
			badgeColor: 'bg-blue-100 text-blue-700'
		},
		{
			titulo: 'Base de Movimientos',
			descripcion: 'Descubre categorías físicas y especiales, potencias, precisiones y PP.',
			icono: '⚡',
			enlace: '/movimientos',
			badge: 'Combate',
			badgeColor: 'bg-amber-100 text-amber-700'
		},
		{
			titulo: 'Gestor de Equipos',
			descripcion: 'Construye y administra tus alineaciones de 6 integrantes con sus ataques.',
			icono: '🛡️',
			enlace: '/equipos',
			badge: 'Estrategia',
			badgeColor: 'bg-emerald-100 text-emerald-700'
		},
		{
			titulo: 'Efectividades y Tipos',
			descripcion: 'Analiza debilidades elementales para formular tu estrategia competitiva.',
			icono: '✨',
			enlace: '/pokemones',
			badge: 'Táctica',
			badgeColor: 'bg-purple-100 text-purple-700'
		}
	];
</script>

<svelte:head>
	<title>IntroDex - Tu Enciclopedia Pokémon Definitiva</title>
</svelte:head>

<div class="space-y-16 pb-16">
	<!-- HERO SECTION -->
	<section
		class="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80"
	>
		<!-- Decoración circular de fondo -->
		<div
			class="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"
		></div>

		<div class="relative max-w-5xl mx-auto px-4 text-center space-y-8">
			<!-- Badge destacado -->
			<div
				class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm text-slate-700"
			>
				<span class="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
				<span class="font-bold text-red-600">IntroDex</span>
				<span class="text-slate-300">&bull;</span>
				<span>Tu Pokédex Académica & Competitiva</span>
			</div>

			<!-- Título y Subtítulo -->
			<div class="space-y-4 max-w-3xl mx-auto">
				<h1
					class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
				>
					Explora, Descubre y Domina el <span
						class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600"
					>
						Mundo Pokémon
					</span>
				</h1>
				<p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
					Consulta estadísticas base, evoluciones, repertorios de movimientos y diseña equipos
					estratégicos con información precisa y actualizada.
				</p>
			</div>

			<!-- Buscador Hero -->
			<div class="max-w-2xl mx-auto">
				<form
					onsubmit={manejarBusqueda}
					class="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
				>
					<div class="pl-3 pr-2 text-slate-400">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
					</div>

					<input
						type="text"
						bind:value={busquedaTexto}
						placeholder="Buscar Pokémon por nombre (ej. Pikachu, Charizard, Gengar)..."
						class="w-full py-2.5 px-2 text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none bg-transparent"
					/>

					<button
						type="submit"
						class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer flex-shrink-0"
					>
						Buscar
					</button>
				</form>

				<!-- Búsquedas Populares -->
				<div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
					<span class="font-medium">Populares:</span>
					{#each sugerenciasPopulares as sugerencia}
						<button
							type="button"
							onclick={() => buscarSugerido(sugerencia)}
							class="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
						>
							{sugerencia}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- EXPLORA POR TIPO -->
	<section class="max-w-7xl mx-auto px-4">
		<div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
			<div
				class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4"
			>
				<div>
					<h2 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
						<svg
							class="w-6 h-6 text-amber-500"
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
						Explora por Tipo Elemental
					</h2>
					<p class="text-sm text-slate-500 mt-0.5">
						Filtra especies al instante según su afinidad elemental
					</p>
				</div>
				<a
					href="/pokemones"
					class="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
				>
					Ver todos los filtros &rarr;
				</a>
			</div>

			<!-- Grid de etiquetas de tipos -->
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
				{#each tiposDisponibles as tipo}
					<a
						href={`/pokemones?tipo=${tipo}`}
						class="group flex items-center justify-center p-1 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
					>
						<EtiquetaTipo {tipo} tamaño="md" />
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ACCIONES RÁPIDAS -->
	<section class="max-w-7xl mx-auto px-4">
		<div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
			<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				¿Qué te gustaría hacer hoy?
			</h2>
			<p class="text-sm text-slate-600">
				Herramientas intuitivas diseñadas para entrenadores, investigadores y entusiastas
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each accionesRapidas as accion}
				<a
					href={accion.enlace}
					class="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
				>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span
								class="text-4xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform"
							>
								{accion.icono}
							</span>
							<span class="text-xs font-bold px-2.5 py-0.5 rounded-full {accion.badgeColor}">
								{accion.badge}
							</span>
						</div>

						<div>
							<h3
								class="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors"
							>
								{accion.titulo}
							</h3>
							<p class="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
								{accion.descripcion}
							</p>
						</div>
					</div>

					<div
						class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800"
					>
						<span>Comenzar</span>
						<svg
							class="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- POKÉMON DESTACADOS -->
	<section class="max-w-7xl mx-auto px-4">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div>
				<h2
					class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"
				>
					<span class="w-3 h-3 rounded-full bg-red-500"></span>
					Pokémon Destacados
				</h2>
				<p class="text-sm text-slate-600 mt-1">
					Explora especies representativas con sus tipos y estadísticas
				</p>
			</div>

			<a
				href="/pokemones"
				class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer"
			>
				<span>Ver todos los Pokémon</span>
				<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					></path>
				</svg>
			</a>
		</div>

		<!-- Grid de tarjetas -->
		{#if data.pokemones && data.pokemones.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{#each data.pokemones as pokemon}
					<TarjetaPokemon {pokemon} />
				{/each}
			</div>
		{:else}
			<div class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
				<p>No se encontraron Pokémon destacados en este momento.</p>
			</div>
		{/if}
	</section>

	<!-- CALL TO ACTION: Creador de Equipos -->
	<section class="max-w-7xl mx-auto px-4">
		<div
			class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800"
		>
			<!-- Círculos decorativos de fondo -->
			<div
				class="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"
			></div>

			<div class="relative max-w-2xl space-y-4">
				<span
					class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30"
				>
					Arma tu Estrategia
				</span>
				<h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
					¿Listo para formar tu equipo definitivo?
				</h2>
				<p class="text-sm sm:text-base text-slate-300 leading-relaxed">
					Selecciona hasta 6 integrantes, configura sus movimientos y personaliza tu plantilla
					competitiva para cualquier desafío.
				</p>
				<div class="pt-2">
					<a
						href="/equipos"
						class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-900 bg-white hover:bg-slate-100 active:scale-95 transition-all shadow-md cursor-pointer text-sm sm:text-base"
					>
						<span>Crear y Gestionar Equipos</span>
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
			</div>
		</div>
	</section>
</div>
