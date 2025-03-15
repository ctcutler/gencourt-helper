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
	const testimony_url: string = bill?.upcoming_hearings?.[0].is_senate
		? SENATE_TESTIMONY_URL
		: HOUSE_TESTIMONY_URL;
</script>

{#if bill}
	{#if bill.upcoming_hearings}
		<div>
			<p>To support/oppose {bill_code}:</p> 
            <ol>
                <li>select {hearingDate} from the calendar</li>
                <li>select {committee} committee</li>
                <li>select {bill_code}</li>
                <li>complete the rest of the form...</li>
            </ol>
		</div>
	{/if}

	<iframe class="h-screen w-full" title="bill info" src={testimony_url}></iframe>
{:else}
	<p>Unable to find bill.</p>
{/if}
