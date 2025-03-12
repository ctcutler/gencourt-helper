<script lang="ts">
	let { data } = $props();

	const bill = data.bills.find((x) => x.bill_code == data.selected_bill_code);
	let upcoming_hearing_date: Date | null = $state(null);
	const now = new Date();
	if (bill) {
		for (const docket_entry of bill.docket) {
			if (docket_entry.is_public_hearing && docket_entry.date > now) {
				upcoming_hearing_date = docket_entry.date;
			}
		}
	}
</script>

{#if bill}
 
{#if upcoming_hearing_date}
  <div><p>Upcoming public hearing on: {upcoming_hearing_date}</p></div>
{/if}
<iframe
	class="h-screen w-full"
	title="bill info"
	src="https://gc.nh.gov/bill_status/billinfo.aspx?id={bill?.id}&inflect=2"
></iframe>
{:else}
<p>Unable to find {data.selected_bill_code}</p>
{/if}