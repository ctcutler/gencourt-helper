<script lang="ts">
	let { data } = $props();

	let sortOrder = $state<'committee' | 'date'>('committee');

	const sortedHearings = $derived.by(() => {
		if (sortOrder === 'committee') {
			return data.hearings;
		}
		// Invert to Map<date, Map<committee, Array<Bill>>>
		let byDate: Map<string, Map<string, Array<Bill>>> = new Map();
		for (const [committee, dates] of data.hearings) {
			for (const [date, bills] of dates) {
				if (!byDate.has(date)) byDate.set(date, new Map());
				byDate.get(date)!.set(committee, bills);
			}
		}
		byDate = new Map([...byDate.entries()].sort());
		for (const [date, committees] of byDate) {
			byDate.set(date, new Map([...committees.entries()].sort()));
		}
		return byDate;
	});
</script>

<div class="flex justify-center bg-yellow-200 p-2">
	<div class="flex flex-col">
		<p class="max-w-4xl">
			Welcome to the General Court Helper, a tool to make it easier to find and give feedback on
			bills being considered by New Hampshire's state legislature (a.k.a. the General Court). Click
			on the bill number below to see details and find instructions to indicate your support or
			opposition.
		</p>
		<p class="max-w-4xl text-right text-xs italic">
			(Built by <a href="https://github.com/ctcutler" class="font-bold text-blue-600"
				>Chris Cutler</a
			>. <a class="font-bold text-blue-600" href="mailto:gencourthelper@gmail.com">Feedback</a>
			is welcome and you can read the
			<a class="font-bold text-blue-600" href="https://github.com/ctcutler/gencourt-helper"
				>source code here.</a
			>)
		</p>
	</div>
</div>
<div class="border"></div>

<div class="flex justify-center">
	<div class="max-w-4xl p-5">
		<h1 class="text-3xl font-bold">Scheduled Hearings</h1>
		<label class="text-sm">
			Sort by:
			<!--select bind:value={sortOrder} class="ml-1 border rounded px-2 pr-8" -->
			<select bind:value={sortOrder} class="text-sm rounded">
				<option value="committee">Committee</option>
				<option value="date">Date</option>
			</select>
		</label>
		<ul>
			{#each sortedHearings as [outer, inner]}
				<li>
					<h2 class="pt-6 text-xl font-bold">
						{#if sortOrder === 'committee'}{outer} Committee{:else}{outer}{/if}
					</h2>
					<ul>
						{#each inner as [innerKey, bills]}
							<li>
								<h3 class="text-l pt-2 pl-4 italic">
									{#if sortOrder === 'committee'}{innerKey}{:else}{innerKey} Committee{/if}
								</h3>
								<ul>
									{#each bills as bill}
										<li class="pl-8">
											<a href="/bills/{bill.bill_code}" class="font-bold text-blue-600"
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
</div>
