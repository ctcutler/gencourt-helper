<script lang="ts">
	import { formatDate } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code == bill_code);
	const hearingDate: string = formatDate(bill?.upcoming_hearings?.[0].date);
</script>

{#if bill}
	{#if bill.upcoming_hearings}
		<div class="bg-yellow-200 p-2">
			<p>
				This bill will have a public hearing on {hearingDate}.
				<a class="font-bold text-blue-600" href="{bill_code}/respond"
					>Click/tap this link to support or oppose it.</a
				>
			</p>
		</div>
	{/if}

	<iframe
		class="h-screen w-full"
		title="bill info"
		src="https://gc.nh.gov/bill_status/billinfo.aspx?id={bill?.id}&inflect=2"
	></iframe>
{:else}
	<p>Unable to find bill.</p>
{/if}
