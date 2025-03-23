<script lang="ts">
	import { format_date } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;

	const HOUSE_SUBMITTED_TESTIMONY_URL = '';
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code == bill_code);
    // TODO: handle more than one house committee
	const committee: string | undefined = bill?.house_committees?.[0];
</script>

{#if bill}
	{#if bill.upcoming_hearings}
		<div class="flex bg-yellow-200 p-2">
			<div class="flex-1">
				<p>
					To see what others have said about <a
						href="/bills/{bill_code}"
						class="font-bold text-blue-600">{bill_code}</a
					>:
				</p>
				<ol class="list-outside list-disc ps-5">
					<li>Select <span class="font-bold">{committee}</span> from the list of committees</li>
					<li>Select <span class="font-bold">{bill_code}</span> from the list of bills</li>
				</ol>
			</div>
			<div class="flex-1 text-right">
				<p>
					<a class="font-bold text-blue-600" href="/bills">Back to Hearings</a>
				</p>
				<p>
					<a class="font-bold text-blue-600" href="/bills/{bill_code}">Back to {bill_code}</a>
				</p>
			</div>
		</div>
	{/if}

	<iframe
		class="h-screen w-full"
		title="bill info"
		src="https://gc.nh.gov/house/committees/remotetestimony/submitted_testimony.aspx"
	></iframe>
{:else}
	<p>Unable to find bill.</p>
{/if}
