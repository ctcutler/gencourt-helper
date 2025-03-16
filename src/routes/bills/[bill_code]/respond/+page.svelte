<script lang="ts">
	import { formatDate } from '$lib/date.js';
	import { page } from '$app/state';

	let { data } = $props();
	const { bill_code } = page.params;

	const SENATE_TESTIMONY_URL = 'https://gc.nh.gov/remotecommittee/senate.aspx';
	const HOUSE_TESTIMONY_URL = 'https://gc.nh.gov/house/committees/remotetestimony/default.aspx';
	const bill: Bill | undefined = data.bills.find((bill) => bill.bill_code == bill_code);
	const hearingDate: string = formatDate(bill?.upcoming_hearings?.[0].date);
	const committee: string = bill?.upcoming_hearings?.[0].committee;
	const is_senate: Boolean = bill?.upcoming_hearings?.[0].is_senate;
	const testimony_url: string = bill?.upcoming_hearings?.[0].is_senate
		? SENATE_TESTIMONY_URL
		: HOUSE_TESTIMONY_URL;
</script>

{#if bill}
	{#if bill.upcoming_hearings}
		<div class="bg-yellow-200 p-2">
			<p>To indicate your position on <span class="font-bold">{bill_code}</span>:</p>
			<ol class="list-outside list-disc ps-5">
				{#if !is_senate}
					<li>Fill in your personal information</li>
				{/if}
				<li>Select <span class="font-bold">{hearingDate}</span> from the calendar</li>
				<li>Select <span class="font-bold">{committee}</span> from the list of committees</li>
				<li>Select <span class="font-bold">{bill_code}</span> from the list of bills</li>
				<li>
					Choose your status (e.g. <span class="font-bold">A Member of the Public</span>) and who
					you're representing (e.g. <span class="font-bold">Myself</span>)
				</li>
				<li>
					Select your position on the bill{#if !is_senate}, leave testimony (optional),{/if} and submit
					the form.
				</li>
			</ol>
		</div>
	{/if}

	<iframe class="h-screen w-full" title="bill info" src={testimony_url}></iframe>
{:else}
	<p>Unable to find bill.</p>
{/if}
