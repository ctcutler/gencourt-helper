<script lang="ts">
	let { data } = $props();

	const SENATE_TESTIMONY_URL = 'https://gc.nh.gov/remotecommittee/senate.aspx';
	const HOUSE_TESTIMONY_URL = 'https://gc.nh.gov/house/committees/remotetestimony/default.aspx';

	function formatDate(d: Date): string {
		return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
	}

	const bill = data.bills.find((x) => x.bill_code == data.selected_bill_code);
	let upcoming_hearing: DocketEntry | null = $state(null);
	let testimony_url: string = $state('');
	const now = new Date();
	if (bill) {
		for (const docket_entry of bill.docket) {
			if (docket_entry.is_hearing && docket_entry.date > now) {
				upcoming_hearing = docket_entry;
				testimony_url = docket_entry.is_senate ? SENATE_TESTIMONY_URL : HOUSE_TESTIMONY_URL;
			}
		}
	}
</script>

{#if bill}
	{#if upcoming_hearing}
		<div>
			<p>
				Upcoming hearing on: {formatDate(upcoming_hearing.date)}, committee: {upcoming_hearing.committee}.
				<a class="font-bold" href={testimony_url}>Click here</a> to indicate your support or opposition.
			</p>
		</div>
	{/if}

	<iframe
		class="h-screen w-full"
		title="bill info"
		src="https://gc.nh.gov/bill_status/billinfo.aspx?id={bill?.id}&inflect=2"
	></iframe>
{:else}
	<p>Unable to find {data.selected_bill_code}</p>
{/if}
