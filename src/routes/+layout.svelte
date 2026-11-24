<script>
	import { navigating } from '$app/state';
	import Encabezado from '#lib/components/Encabezado.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col relative">
	{#if navigating.current}
		<!-- Barra de carga superior -->
		<div class="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-slate-200 overflow-hidden">
			<div class="h-full bg-blue-600 animate-pulse w-full"></div>
		</div>

		<!-- Indicador flotante de carga -->
		<div
			class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl px-4 py-2.5 rounded-full text-slate-700 text-sm font-medium"
		>
			<svg
				class="animate-spin h-4 w-4 text-blue-600"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<span>Cargando...</span>
		</div>
	{/if}

	<!-- Header -->
	<Encabezado />

	<!-- Contenido principal -->
	<main class="flex-1">
		{@render children?.()}
	</main>

	<footer class="bg-slate-800 text-white py-12 mt-12">
		<div class="max-w-7xl mx-auto px-16">
			<!-- Contenido del footer -->

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<!-- grid -->

				<div class="md:col-span-1">
					<!-- Parte izquierda -->
					<h4 class="text-lg font-semibold mb-4 text-white">IntroDex</h4>
					<p class="text-slate-400 mb-2">Proyecto Integrador Académico</p>
					<p class="text-slate-400 mb-2">Introducción al Desarrollo de Software</p>
					<p class="text-slate-400">Universidad de Buenos Aires</p>
				</div>
				<!-- Parte izquierda -->

				<div>
					<!-- Medio -->
					<h5 class="text-base font-semibold mb-4 text-white">Explorar</h5>
					<ul class="space-y-2">
						<li>
							<a href="/pokemones" class="text-slate-400 hover:text-white transition-colors">
								Pokémon
							</a>
						</li>
						<li>
							<a href="/movimientos" class="text-slate-400 hover:text-white transition-colors">
								Movimientos
							</a>
						</li>
						<li>
							<a href="/equipos" class="text-slate-400 hover:text-white transition-colors">
								Equipos
							</a>
						</li>
					</ul>
				</div>
				<!-- Medio -->
			</div>
			<!-- grid -->
		</div>
		<!-- Contenido del footer -->
	</footer>
</div>
