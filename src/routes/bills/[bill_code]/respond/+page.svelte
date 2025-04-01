<script lang="ts">
	import { format_date } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;

	const SENATE_TESTIMONY_URL = 'https://gc.nh.gov/remotecommittee/senate.aspx';
	const HOUSE_TESTIMONY_URL = 'https://gc.nh.gov/house/committees/remotetestimony/default.aspx';
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code == bill_code);
	const hearing_date: string = format_date(bill?.upcoming_hearings?.[0].date);
	const committee: string = bill?.upcoming_hearings?.[0].committee;
	const is_senate: Boolean = bill?.upcoming_hearings?.[0].is_senate;
	const testimony_url: string = bill?.upcoming_hearings?.[0].is_senate
		? SENATE_TESTIMONY_URL
		: HOUSE_TESTIMONY_URL;
</script>

<div class="flex h-dvh flex-col">
	{#if bill}
		{#if bill.upcoming_hearings}
			<div class="bg-yellow-200 p-2">
				<div class="float-right text-right bg-yellow-50 p-2 rounded-lg">
					<p>
						<a class="font-bold text-blue-600" href="/bills">Back to Hearings</a>
					</p>
					<p>
						<a class="font-bold text-blue-600" href="/bills/{bill_code}">Back to {bill_code}</a>
					</p>
				</div>
				<div>
					<p>
						To indicate your position on <a
							href="/bills/{bill_code}"
							class="font-bold text-blue-600">{bill_code}</a
						>:
					</p>
					<ol class="list-outside list-disc ps-5">
						{#if !is_senate}
							<li>Fill in your personal information</li>
						{/if}
						<li>Select <span class="font-bold">{hearing_date}</span> from the calendar</li>
						<li>Select <span class="font-bold">{committee}</span> from the list of committees</li>
						<li>Select <span class="font-bold">{bill_code}</span> from the list of bills</li>
						<li>
							Choose your status (e.g. <span class="font-bold">A Member of the Public</span>) and
							who you're representing (e.g. <span class="font-bold">Myself</span>)
						</li>
						<li>
							Select your position on the bill{#if !is_senate}, leave testimony (optional),{/if} and
							submit the form.
						</li>
					</ol>
				</div>
			</div>
		{/if}
		<div class="border"></div>

		<iframe class="w-full grow" title="bill info" src={testimony_url}></iframe>
	{:else}
		<p>Unable to find bill.</p>
	{/if}
</div>
