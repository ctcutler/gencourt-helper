<script lang="ts">
	import { format_date } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code.toLowerCase() == bill_code.toLowerCase());
	const hearing_date: string = format_date(bill?.upcoming_hearings?.[0].date);
</script>

<div class="flex h-dvh flex-col">
	{#if bill}
		{#if bill.upcoming_hearings}
			<div class="bg-yellow-200 p-2">
				<div class="float-right text-right">
					<p class="p-1">
						<a class="rounded-lg bg-yellow-50 p-1 font-bold text-blue-600" href="/bills"
							>Back to Hearings</a
						>
					</p>
				</div>
				<div>
					<p>
						This bill will have a public hearing on <span class="font-bold">{hearing_date}</span>.
						You can:
					</p>
					<ul class="list-outside list-disc ps-5">
						<li>
							<a class="font-bold text-blue-600" href="{bill.bill_code}/testimony"
								>See other people's testimony</a
							>
						</li>
						<li>
							<a class="font-bold text-blue-600" href="{bill.bill_code}/respond">Support or oppose it</a>
						</li>
					</ul>
				</div>
			</div>
		{/if}
		<div class="border"></div>

		<iframe
			class="w-full grow"
			title="bill info"
			src="https://gc.nh.gov/bill_status/billinfo.aspx?id={bill?.id}&inflect=2"
		></iframe>
	{:else}
		<p>Unable to find bill.</p>
	{/if}
</div>
