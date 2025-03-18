<script lang="ts">
	import { format_date } from '$lib/date.js';

	let { data } = $props();
</script>

<div class="max-w-4xl p-5">
	<h1 class="p-2 text-3xl font-bold">Bills With a Scheduled Hearing</h1>
	<ul>
		{#each data.committees_to_bills as committee_to_bill}
			<h2 class="p-2 text-xl font-bold">{committee_to_bill[0]} Committee</h2>
			{#each committee_to_bill[1] as bill}
				<li class="p-2">
					<a href="/bills/{bill.bill_code}" class="font-bold underline">{bill.bill_code}</a>: {bill.title}
					<span class="italic">Hearing date: {format_date(bill.upcoming_hearings?.[0].date)}</span>
				</li>
			{/each}
		{/each}
	</ul>
</div>
