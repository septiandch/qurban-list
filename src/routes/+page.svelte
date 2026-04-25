<script lang="ts">
  let { data } = $props();

  let query = $state("");
  const grouped = $derived(data.data);

   // ✅ Total count
  const totalCount = $derived(Object.values(grouped)
    .reduce((sum, arr:any) => sum + arr.length, 0));

  // ✅ Max group ID
  const maxGroupId = $derived(Math.max(
      ...Object.keys(grouped).map(Number)
    ));
      

  // 🔍 Filter groups based on search
  const filteredGroups = $derived(Object.entries(grouped).filter(([_, items]) => {
    if (!query) return true;

    return items.some((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }));
</script>

<div class="flex justify-center">
    <div class="flex flex-col gap-2 p-4">
    
    <h1 class="text-center w-full font-bold text-xl mb-4">List pendaftaran hewan qurban 1447 H</h1>

    <span class="text-center w-full font-bold text-md mb-4">Total {totalCount} pendaftar - {maxGroupId} ekor sapi</span>

    <input
        type="text"
        class="mb-4 p-2 w-full border rounded-md"
        placeholder="Cari nama..."
        bind:value={query}
    />

    {#if filteredGroups.length === 0}
    <p>No results found</p>
    {/if}

    {#each filteredGroups as [groupId, data]}
    {@const isNonCollective = data.some((item) => item.status.includes("Non"))}
    <div class="mb-4">
        <h2 class="font-bold">{`🐂 Sapi No. ${groupId}${isNonCollective? " (Non-Kolektif)" : ""}`}</h2>

        <ul>
          {#each data as item, i}
            {#if item.status.includes("Non")}
              <li>- {item.name}</li>
            {:else}
              <li>{i + 1} - {item.name}</li>
            {/if}
          {/each}
        </ul>
    </div>
    {/each}
    </div>
</div>