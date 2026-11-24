<script>
	import { onDestroy } from 'svelte';

	let {
		placeholder = 'Buscar...',
		endpoint,
		minQueryLength = 2,
		debounceTime = 300,
		disabled = false,
		onselect = null
	} = $props();

	let query = $state('');
	let results = $state([]);
	let showDropdown = $state(false);
	let cargando = $state(false);
	let timeout;

	function onInput() {
		clearTimeout(timeout);
		if (query.trim().length < minQueryLength) {
			results = [];
			showDropdown = false;
			return;
		}
		timeout = setTimeout(fetchResults, debounceTime);
	}

	async function fetchResults() {
		try {
			cargando = true;
			const cleanEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
			const url = new URL(cleanEndpoint);
			url.searchParams.set('nombre_parcial', query.trim());
			url.searchParams.set('limit', '8');

			const response = await fetch(url.toString(), {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				const data = await response.json();
				results = Array.isArray(data) ? data : [];
				showDropdown = results.length > 0;
			}
		} catch (e) {
			console.error('Error fetching typeahead results:', e);
		} finally {
			cargando = false;
		}
	}

	function selectResult(result) {
		query = result.nombre;
		showDropdown = false;
		if (onselect) {
			onselect(result);
		}
	}

	function handleBlur() {
		setTimeout(() => {
			showDropdown = false;
		}, 200);
	}

	onDestroy(() => {
		if (timeout) clearTimeout(timeout);
	});
</script>

<div class="relative w-full">
	<div class="relative">
		<input
			class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
			type="text"
			bind:value={query}
			oninput={onInput}
			onblur={handleBlur}
			onfocus={() => {
				if (results.length > 0) showDropdown = true;
			}}
			{placeholder}
			{disabled}
			autocomplete="off"
		/>
		<svg
			class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none"
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

		{#if cargando}
			<div class="absolute right-3.5 top-3.5">
				<div
					class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
				></div>
			</div>
		{:else if query}
			<button
				type="button"
				onclick={() => {
					query = '';
					results = [];
					showDropdown = false;
				}}
				class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
			>
				&times;
			</button>
		{/if}
	</div>

	{#if showDropdown && results.length > 0}
		<div
			class="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xl z-50 divide-y divide-slate-100"
		>
			{#each results as result}
				<div
					role="button"
					tabindex="0"
					onmousedown={() => selectResult(result)}
					class="p-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group text-left"
				>
					<div class="flex items-center gap-2.5 min-w-0">
						{#if result.imagen}
							<img
								src={result.imagen}
								alt={result.nombre}
								class="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform"
							/>
						{:else}
							<div
								class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono"
							>
								#{result.id}
							</div>
						{/if}
						<span
							class="font-semibold text-slate-800 text-sm capitalize truncate group-hover:text-blue-600"
						>
							{result.nombre}
						</span>
					</div>

					{#if result.tipo}
						<span
							class="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium capitalize shrink-0"
						>
							{result.tipo.nombre || result.tipo}
						</span>
					{:else if result.categoria}
						<span
							class="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium capitalize shrink-0"
						>
							{result.categoria}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
