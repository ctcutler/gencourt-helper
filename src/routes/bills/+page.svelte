<script lang="ts">
	let { data } = $props();
</script>

<div class="p-5 max-w-4xl">
	<h1 class="font-bold text-2xl p-2">Bills & Resolutions from the Current Legislative Session</h1>

	<ul>
		{#each data.bills as bill}
			<li class="p-2"><a href="/bills/{bill.bill_code}" class="font-bold underline">{bill.bill_code}</a>: {bill.title}</li>
		{/each}
	</ul>	
</div>
