<script>
	import { page } from '$app/state';

	let status = $derived(page.status || 500);
	let message = $derived(page.error?.message || '');

	let isServerDown = $derived(status !== 404);

	function reintentar() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{isServerDown ? 'Servidor no disponible' : 'Página no encontrada'} - IntroDex</title>
</svelte:head>

<div class="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
	<div
		class="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center"
	>
		<!-- Icono representativo -->
		<div class="mx-auto mb-6 flex items-center justify-center">
			{#if isServerDown}
				<div
					class="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner"
				>
					<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						></path>
					</svg>
				</div>
			{:else}
				<div
					class="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner"
				>
					<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 9v2m0 4h.01"
						></path>
					</svg>
				</div>
			{/if}
		</div>

		<!-- Badge de Estado -->
		<div
			class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 {isServerDown
				? 'bg-amber-100 text-amber-800'
				: 'bg-blue-100 text-blue-800'}"
		>
			<span
				class="w-2 h-2 rounded-full {isServerDown ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}"
			></span>
			{isServerDown ? `Error de servidor (${status})` : `No encontrado (${status})`}
		</div>

		<!-- Título principal -->
		<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
			{#if isServerDown}
				El servidor no está disponible
			{:else}
				Página no encontrada
			{/if}
		</h1>

		<!-- Mensaje -->
		<p class="text-slate-600 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
			{#if isServerDown}
				El servidor no se encuentra en ejecución o no responde en este momento. Por favor, intenta
				nuevamente más tarde.
			{:else}
				La página que buscas no existe o no se encuentra disponible.
			{/if}
		</p>

		<!-- Botones de Acción -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3">
			<button
				onclick={reintentar}
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					></path>
				</svg>
				Reintentar
			</button>

			<a
				href="/"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
			>
				<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					></path>
				</svg>
				Ir al inicio
			</a>
		</div>

		{#if message && message !== 'Internal Error'}
			<!-- Mensaje de detalle si existe -->
			<div class="mt-8 text-xs text-slate-400">
				<span>Detalle: {message}</span>
			</div>
		{/if}
	</div>
</div>
