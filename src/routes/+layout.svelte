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

	<footer class="bg-slate-900 text-slate-300 py-12 mt-16 border-t border-slate-800">
		<div class="max-w-5xl mx-auto px-6 text-center space-y-4">
			<!-- Badge institucional -->
			<div
				class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-blue-400"
			>
				<svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
					></path>
				</svg>
				<span>Proyecto Académico Universitario</span>
			</div>

			<!-- Título y materia -->
			<div class="space-y-1.5">
				<h4 class="text-xl font-bold text-white tracking-tight">IntroDex</h4>
				<p class="text-sm sm:text-base font-medium text-slate-200">
					Proyecto Integrador para la materia <span class="text-blue-400 font-semibold">
						Introducción al Desarrollo de Software
					</span>
				</p>
			</div>

			<!-- Universidad y Facultad -->
			<div
				class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-400"
			>
				<span class="font-semibold text-slate-300">Facultad de Ingeniería (FIUBA)</span>
				<span class="hidden sm:inline text-slate-600">&bull;</span>
				<span>Universidad de Buenos Aires (UBA)</span>
			</div>

			<!-- Propósito formativo -->
			<p
				class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed pt-2 border-t border-slate-800"
			>
				Desarrollado con fines educativos y de aprendizaje práctico como parte del plan académico de
				Ingeniería.
			</p>
		</div>
	</footer>
</div>
