<script lang="ts">
	import { format_date } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;

	const HOUSE_SUBMITTED_TESTIMONY_URL = '';
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code.toLowerCase() == bill_code.toLowerCase());
	const committee: string | undefined = bill?.house_committees?.[0];
</script>

<div class="flex h-dvh flex-col">
	{#if bill}
		{#if bill.upcoming_hearings}
			<div class=" bg-yellow-200 p-2">
				<div class="float-right text-right">
					<p class="p-1">
						<a class="rounded-lg bg-yellow-50 p-1 font-bold text-blue-600" href="/bills"
							>Back to Hearings</a
						>
					</p>
					<p class="p-1">
						<a class="rounded-lg bg-yellow-50 p-1 font-bold text-blue-600" href="/bills/{bill.bill_code}"
							>Back to {bill.bill_code}</a
						>
					</p>
				</div>
				<div>
					<p>
						To see what others have said about <a
							href="/bills/{bill.bill_code}"
							class="font-bold text-blue-600">{bill.bill_code}</a
						>:
					</p>
					<ol class="list-outside list-disc ps-5">
						<li>Select <span class="font-bold">{committee}</span> from the list of committees</li>
						<li>Select <span class="font-bold">{bill.bill_code}</span> from the list of bills</li>
					</ol>
				</div>
			</div>
		{/if}
		<div class="border"></div>

		<iframe
			class="w-full grow"
			title="bill info"
			src="https://gc.nh.gov/house/committees/remotetestimony/submitted_testimony.aspx"
		></iframe>
	{:else}
		<p>Unable to find bill.</p>
	{/if}
</div>
