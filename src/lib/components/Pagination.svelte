<script>
	import { page } from '$app/state';

	let { currentPage = 0, pageSize: _pageSize = 20, hasMore = true } = $props();

	let numPage = $derived(Number.isNaN(Number(currentPage)) ? 0 : Math.max(0, Number(currentPage)));

	function getPageUrl(targetPage) {
		const url = new URL(page.url);
		url.searchParams.set('page', Math.max(0, targetPage).toString());

		// Clean up internal SvelteKit form action keys if any were present
		for (const key of Array.from(url.searchParams.keys())) {
			if (key.startsWith('/')) {
				url.searchParams.delete(key);
			}
		}

		return `${url.pathname}?${url.searchParams.toString()}`;
	}

	function scrollToTop() {
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<nav aria-label="Navegación de páginas" class="inline-flex items-center gap-2">
	<!-- Botón Primera Página (visible si está en página 2 en adelante) -->
	{#if numPage > 1}
		<a
			href={getPageUrl(0)}
			onclick={scrollToTop}
			data-sveltekit-preload-data="hover"
			title="Ir a la primera página"
			class="hidden sm:inline-flex items-center justify-center px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 border border-slate-200 shadow-xs transition-all cursor-pointer active:scale-95 text-xs font-semibold"
		>
			Pág. 1
		</a>
		{#if numPage > 2}
			<span class="hidden sm:inline-block text-slate-400 text-xs px-0.5 select-none">&hellip;</span>
		{/if}
	{/if}

	<!-- Botón Anterior -->
	{#if numPage > 0}
		<a
			href={getPageUrl(numPage - 1)}
			onclick={scrollToTop}
			data-sveltekit-preload-data="hover"
			aria-label="Página anterior"
			class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200 active:scale-95 cursor-pointer hover:shadow-sm"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
				></path>
			</svg>
			<span>Anterior</span>
		</a>
	{:else}
		<span
			aria-disabled="true"
			class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs bg-slate-100/70 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50 select-none"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
				></path>
			</svg>
			<span>Anterior</span>
		</span>
	{/if}

	<!-- Indicador de Página Actual -->
	<div
		class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium shadow-2xs select-none"
	>
		<span class="text-slate-500 font-normal">Página</span>
		<span
			class="font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs"
		>
			{numPage + 1}
		</span>
	</div>

	<!-- Botón Siguiente -->
	{#if hasMore}
		<a
			href={getPageUrl(numPage + 1)}
			onclick={scrollToTop}
			data-sveltekit-preload-data="hover"
			aria-label="Página siguiente"
			class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer shadow-md hover:shadow-lg"
		>
			<span>Siguiente</span>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</a>
	{:else}
		<span
			aria-disabled="true"
			class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs bg-slate-100/70 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50 select-none"
		>
			<span>Siguiente</span>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</span>
	{/if}
</nav>
