<script lang="ts">
	import EtiquetaTipo from './EtiquetaTipo.svelte';

	interface Props {
		pokemon: any;
	}

	let { pokemon }: Props = $props();
</script>

<div
	class="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
>
	<!-- Imagen con fondo suave -->
	<a
		href={`/pokemones/${pokemon.id}`}
		class="block relative bg-gradient-to-b from-slate-50 to-slate-100/60 p-6 text-center overflow-hidden cursor-pointer"
	>
		<span
			class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-slate-500 border border-slate-200/80 shadow-xs"
		>
			#{pokemon.id ? pokemon.id.toString().padStart(3, '0') : '???'}
		</span>

		<img
			src={pokemon.imagen || `/placeholder.svg?height=140&width=140`}
			alt={pokemon.nombre}
			class="w-32 h-32 object-contain mx-auto drop-shadow-md group-hover:scale-110 transition-transform duration-300"
			loading="lazy"
		/>
	</a>

	<!-- Cuerpo: Nombre, Tipos y Acción -->
	<div class="p-5 flex flex-col flex-1 justify-between gap-4">
		<div>
			<a href={`/pokemones/${pokemon.id}`} class="block text-center cursor-pointer">
				<h3
					class="text-lg font-bold text-slate-800 capitalize group-hover:text-blue-600 transition-colors"
				>
					{pokemon.nombre}
				</h3>
			</a>

			<div class="flex flex-wrap justify-center gap-1.5 mt-2.5">
				{#each pokemon.tipos || [] as tipo}
					<EtiquetaTipo tipo={tipo.nombre || tipo} tamaño="sm" />
				{/each}
			</div>
		</div>

		<!-- Botón de detalles -->
		<a
			href={`/pokemones/${pokemon.id}`}
			class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95 text-center cursor-pointer"
		>
			<span>Ver detalles</span>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</a>
	</div>
</div>
