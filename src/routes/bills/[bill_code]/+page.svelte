<script lang="ts">
	let { data } = $props();

	const bill = data.bills.find((x) => x.bill_code == data.selected_bill_code);
</script>

<h1>{bill?.bill_code} details</h1>

<p>Bill title: {bill?.title}</p>
<iframe title="bill info" src="https://gc.nh.gov/bill_status/billinfo.aspx?id={bill?.id}&inflect=2"
></iframe>

<p>Feedback page</p>
<p>Instructions for leaving feedback</p>

<a href="/bills">Return to list of bills</a>

<ul>
	<li>
		FIXME: build bill details iframe (need id, etc.)... id is in
		https://gc.nh.gov/dynamicdatadump/LsrsOnly.txt
	</li>
	<li>FIXME: build bill text iframe (need id, etc.)</li>
	<li>FIXME: build testimony submission iframe</li>
	<li>FIXME: build testimony instructions text</li>
</ul>
