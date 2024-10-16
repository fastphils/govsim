<script>
	import { onMount } from "svelte";
	let el;

	onMount(async () => {
	  const { createEditor } = await import("../lib/editor");
	  createEditor(el);
	});
</script>

<div class="rete" bind:this={el} />


<style>
	.rete {
	  position: relative;
	  width: 100vw;
	  height: 100vh;
	  font-size: 1rem;
	  text-align: left;
	  border: 1px solid #cbd0db;
	}

	:global(body) {
	  margin: 0;
	  overflow: hidden;
	}
</style>
