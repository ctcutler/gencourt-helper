<script lang="ts">
	let { data } = $props();
</script>

<div class="max-w-4xl p-5">
	<h1 class="text-3xl font-bold">Scheduled Hearings</h1>
	<ul>
		{#each data.hearings as committee_dates}
			<li>
				<h2 class="pt-6 text-xl font-bold">{committee_dates[0]} Committee</h2>
				<ul>
					{#each committee_dates[1] as date_bills}
						<li>
							<h3 class="pl-4 pt-2 text-l italic">{date_bills[0]}</h3>
							<ul>
								{#each date_bills[1] as bill}
									<li class="pl-8">
										<a href="/bills/{bill.bill_code}" class="font-bold underline"
											>{bill.bill_code}</a
										>: {bill.title}
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
