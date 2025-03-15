<script lang="ts">
	import { formatDate } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code == bill_code);
	const hearingDate: string = formatDate(bill?.upcoming_hearings?.[0].date);
	const committee: string = bill?.upcoming_hearings?.[0].committee || "";
</script>

{#if bill}
	{#if bill.upcoming_hearings}
		<div>
			<p>
				Upcoming hearing on: {hearingDate}, committee: {committee}.
				<a class="font-bold" href="{bill_code}/respond">Click here</a> to indicate your support or
				opposition.
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
