<script lang="ts">
	let { data } = $props();
</script>

<h1>List of bills</h1>

<ul>
	{#each data.bills as bill}
		<li><a href="/bills/{bill.bill_code}">{bill.bill_code} ({bill.title})</a></li>
	{/each}
</ul>
