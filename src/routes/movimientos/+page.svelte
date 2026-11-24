<script>
	import EtiquetaTipo from '#lib/components/EtiquetaTipo.svelte';
	import Pagination from '#lib/components/Pagination.svelte';

	let { data } = $props();

	let busquedaLocal = $state('');
	let vistaModo = $state('tabla'); // 'tabla' | 'tarjetas'

	let movimientosFiltrados = $derived(
		(data.movimientos || []).filter((m) =>
			m.nombre.toLowerCase().includes(busquedaLocal.trim().toLowerCase())
		)
	);

	function categoriaEstilo(cat) {
		const c = (cat || '').toLowerCase();
		if (c === 'físico' || c === 'fisico') {
			return 'bg-orange-100 text-orange-800 border-orange-200';
		}
		if (c === 'especial') {
			return 'bg-indigo-100 text-indigo-800 border-indigo-200';
		}
		return 'bg-slate-100 text-slate-700 border-slate-200';
	}
</script>

<svelte:head>
	<title>Movimientos - IntroDex</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto space-y-8">
		<!-- Breadcrumbs y Título -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
					<a href="/" class="hover:text-blue-600 transition-colors">Inicio</a>
					<span>&bull;</span>
					<span class="text-slate-800 font-medium">Movimientos</span>
				</nav>
				<h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
					Explorar Movimientos
				</h1>
				<p class="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
					Consulta todos los movimientos disponibles, sus efectos, potencias, tipos y precisión.
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

				{#if data.query || data.query2}
					<a
						href="/movimientos"
						class="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
					>
						Limpiar filtros
					</a>
				{/if}
			</div>

			<form method="GET" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
				<!-- Buscar por nombre (servidor) -->
				<div class="md:col-span-6 space-y-1.5">
					<label
						for="nombre_parcial"
						class="text-xs font-bold uppercase tracking-wider text-slate-500"
					>
						Buscar por Nombre
					</label>
					<div class="relative">
						<input
							id="nombre_parcial"
							name="nombre_parcial"
							type="text"
							placeholder="Ej: Lanzallamas, Terremoto, Rayo..."
							value={data.query || ''}
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

				<!-- Filtrar por tipo -->
				<div class="md:col-span-4 space-y-1.5">
					<label for="tipo" class="text-xs font-bold uppercase tracking-wider text-slate-500">
						Tipo Elemental
					</label>
					<select
						id="tipo"
						name="tipo"
						value={data.query2 || ''}
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer capitalize"
					>
						<option value="">Todos los tipos</option>
						<option value="normal">Normal</option>
						<option value="lucha">Lucha</option>
						<option value="volador">Volador</option>
						<option value="veneno">Veneno</option>
						<option value="tierra">Tierra</option>
						<option value="roca">Roca</option>
						<option value="insecto">Insecto</option>
						<option value="fantasma">Fantasma</option>
						<option value="acero">Acero</option>
						<option value="fuego">Fuego</option>
						<option value="agua">Agua</option>
						<option value="planta">Planta</option>
						<option value="electrico">Eléctrico</option>
						<option value="psiquico">Psíquico</option>
						<option value="hielo">Hielo</option>
						<option value="dragon">Dragón</option>
						<option value="siniestro">Siniestro</option>
						<option value="hada">Hada</option>
						<option value="oscuro">Oscuro</option>
					</select>
				</div>

				<!-- Botón enviar -->
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
			</form>

			<!-- Filtros activos -->
			{#if data.query || data.query2}
				<div class="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 text-xs">
					<span class="font-semibold text-slate-500">Filtros activos:</span>
					{#if data.query}
						<span
							class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium"
						>
							Búsqueda: "{data.query}"
							<a
								href="?tipo={data.query2 || ''}"
								class="hover:text-blue-900 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
							>
								&times;
							</a>
						</span>
					{/if}
					{#if data.query2}
						<span
							class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full"
						>
							<EtiquetaTipo tipo={data.query2} tamaño="sm" />
							<a
								href="?nombre_parcial={data.query || ''}"
								class="hover:text-slate-900 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
							>
								&times;
							</a>
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- BARRA DE RESULTADOS Y SELECTOR DE VISTA -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-slate-800">
					Resultados <span class="text-sm font-normal text-slate-500">
						({movimientosFiltrados.length} en pantalla)
					</span>
				</span>

				<!-- Switch vista Tabla / Tarjetas -->
				<div class="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
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
					<button
						onclick={() => (vistaModo = 'tarjetas')}
						title="Vista en tarjetas"
						class="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {vistaModo ===
						'tarjetas'
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
				</div>
			</div>

			<!-- Paginación superior -->
			<Pagination currentPage={data.currentPage} pageSize={data.pageSize} hasMore={data.hasMore} />
		</div>

		<!-- CONTENIDO: TABLA O TARJETAS -->
		{#if movimientosFiltrados && movimientosFiltrados.length > 0}
			{#if vistaModo === 'tabla'}
				<!-- Vista de Tabla Moderna -->
				<div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm border-collapse">
							<thead>
								<tr
									class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200"
								>
									<th class="p-4 font-semibold">Movimiento</th>
									<th class="p-4 font-semibold">Tipo</th>
									<th class="p-4 font-semibold text-center">Categoría</th>
									<th class="p-4 font-semibold text-center">Potencia</th>
									<th class="p-4 font-semibold text-center">Precisión</th>
									<th class="p-4 font-semibold text-center">PP</th>
									<th class="p-4 font-semibold">Generación</th>
									<th class="p-4 font-semibold">Efecto</th>
									<th class="p-4 text-right">Acción</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each movimientosFiltrados as mov}
									<tr class="hover:bg-slate-50/80 transition-colors">
										<td class="p-4">
											<a
												href={`/movimientos/${mov.id}`}
												class="font-bold text-slate-800 hover:text-blue-600 transition-colors capitalize inline-flex items-center gap-1.5"
											>
												{mov.nombre}
											</a>
										</td>
										<td class="p-4">
											<EtiquetaTipo tipo={mov.tipo.nombre} tamaño="sm" />
										</td>
										<td class="p-4 text-center">
											<span
												class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border {categoriaEstilo(
													mov.categoria
												)} capitalize"
											>
												{mov.categoria || '—'}
											</span>
										</td>
										<td class="p-4 text-center font-mono font-medium text-slate-700">
											{mov.potencia || '—'}
										</td>
										<td class="p-4 text-center font-mono font-medium text-slate-700">
											{mov.precision ? `${mov.precision}%` : '—'}
										</td>
										<td class="p-4 text-center font-mono font-medium text-slate-700">
											{mov.puntos_de_poder}
										</td>
										<td class="p-4 text-xs text-slate-500">
											{mov.generacion.nombre}
										</td>
										<td class="p-4 text-xs text-slate-500 max-w-xs truncate" title={mov.efecto}>
											{mov.efecto || '—'}
										</td>
										<td class="p-4 text-right">
											<a
												href={`/movimientos/${mov.id}`}
												class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-medium text-xs transition-colors cursor-pointer"
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
			{:else}
				<!-- Vista en Tarjetas -->
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{#each movimientosFiltrados as mov}
						<div
							class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between gap-4"
						>
							<div class="space-y-3">
								<div class="flex items-center justify-between gap-2">
									<EtiquetaTipo tipo={mov.tipo.nombre} tamaño="sm" />
									<span
										class="text-[11px] font-semibold px-2 py-0.5 rounded border capitalize {categoriaEstilo(
											mov.categoria
										)}"
									>
										{mov.categoria || 'Estado'}
									</span>
								</div>

								<a href={`/movimientos/${mov.id}`}>
									<h3
										class="font-bold text-lg text-slate-800 capitalize hover:text-blue-600 transition-colors"
									>
										{mov.nombre}
									</h3>
								</a>

								<!-- 3 Métricas en cards pequeñas -->
								<div class="grid grid-cols-3 gap-2 text-center pt-1">
									<div class="bg-slate-50 rounded-xl p-2 border border-slate-100">
										<span class="text-[10px] uppercase font-bold text-slate-400 block">POT</span>
										<span class="font-mono font-bold text-xs text-slate-700">
											{mov.potencia || '—'}
										</span>
									</div>
									<div class="bg-slate-50 rounded-xl p-2 border border-slate-100">
										<span class="text-[10px] uppercase font-bold text-slate-400 block">PREC</span>
										<span class="font-mono font-bold text-xs text-slate-700">
											{mov.precision ? `${mov.precision}%` : '—'}
										</span>
									</div>
									<div class="bg-slate-50 rounded-xl p-2 border border-slate-100">
										<span class="text-[10px] uppercase font-bold text-slate-400 block">PP</span>
										<span class="font-mono font-bold text-xs text-slate-700">
											{mov.puntos_de_poder}
										</span>
									</div>
								</div>

								<p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
									{mov.efecto || 'Sin descripción disponible.'}
								</p>
							</div>

							<a
								href={`/movimientos/${mov.id}`}
								class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent font-medium text-xs transition-all text-center cursor-pointer"
							>
								<span>Ver detalle</span>
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</a>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Paginación Inferior -->
			<div class="flex justify-center pt-4">
				<Pagination
					currentPage={data.currentPage}
					pageSize={data.pageSize}
					hasMore={data.hasMore}
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
					💫
				</div>
				<h3 class="text-xl font-bold text-slate-800">No se encontraron movimientos</h3>
				<p class="text-sm text-slate-600">
					No hay movimientos que coincidan con los criterios de búsqueda. Prueba ajustando los
					filtros.
				</p>
				<a
					href="/movimientos"
					class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
				>
					Restablecer filtros
				</a>
			</div>
		{/if}
	</div>
</div>
