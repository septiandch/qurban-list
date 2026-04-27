<script lang="ts">
  let { data } = $props();

  let query = $state("");

  // ✅ Types (same as +page.ts)
  type DataType = { name: string; status: string };
  type GroupedData = Record<string, DataType[]>;
  type CategorizedData = Record<string, GroupedData>;

  const grouped = $derived<GroupedData>(data.data);

  // 🧠 Map status → category
  function getCategory(status: string) {
    const s = status.toLowerCase();

    if (s.includes("non")) return "Sapi Non-Kolektif";
    if (s.includes("kolektif")) return "Sapi Kolektif";
    if (s.includes("titip kambing")) return "Titip Kambing";
    if (s.includes("titip sapi")) return "Titip Sapi";

    return "Lainnya";
  }

  // 📦 Categorized groups
  const categorizedGroups = $derived(
    (() => {
      const result: CategorizedData = {};

      Object.entries(grouped).forEach(([groupId, items]) => {
        items.forEach((item) => {
          const category = getCategory(item.status);

          if (!result[category]) result[category] = {};
          if (!result[category][groupId]) result[category][groupId] = [];

          result[category][groupId].push(item);
        });
      });

      return result;
    })(),
  );

  // 🔍 Filtered categories
  const filteredCategories = $derived(
    (() => {
      const result: CategorizedData = {};

      Object.entries(categorizedGroups).forEach(([category, groups]) => {
        const filteredGroups = Object.entries(groups)
          .map(([groupId, items]) => {
            const filteredItems = items.filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase()),
            );

            return [groupId, filteredItems] as [string, DataType[]];
          })
          .filter(([_, items]) => items.length > 0);

        if (filteredGroups.length > 0) {
          result[category] = Object.fromEntries(filteredGroups);
        }
      });

      return result;
    })(),
  );

  // ✅ Summary (Peserta, Sapi, Kambing)
  const summary = $derived(
    (() => {
      let totalPeserta = 0;
      let totalKambing = 0;

      Object.values(grouped).forEach((items) => {
        items.forEach((item) => {
          totalPeserta++;

          const status = item.status.toLowerCase();

          if (status.includes("kambing")) {
            totalKambing++;
          }
        });
      });

      // 🐂 total sapi = max group ID
      const numericIds = Object.keys(grouped)
        .filter((id) => !isNaN(Number(id)))
        .map(Number);

      const totalSapi = numericIds.length ? Math.max(...numericIds) : 0;

      return {
        totalPeserta,
        totalSapi,
        totalKambing,
      };
    })(),
  );

  // ✅ Max group ID (ignore "-")
  const maxGroupId = $derived(
    (() => {
      const numericIds = Object.keys(grouped)
        .filter((id) => !isNaN(Number(id)))
        .map(Number);

      return numericIds.length ? Math.max(...numericIds) : 0;
    })(),
  );

  // 🎨 Category order
  const categoryOrder = [
    "Sapi Kolektif",
    "Sapi Non-Kolektif",
    "Titip Sapi",
    "Titip Kambing",
    "Lainnya",
  ];

  const sortedCategories = $derived(
    (() => {
      return Object.entries(filteredCategories).sort(
        ([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
      );
    })(),
  );

  // 🐂 Merge all sapi into one grouped structure
  const sapiGroups = $derived(
    (() => {
      const result: GroupedData = {};

      Object.entries(grouped).forEach(([groupId, items]) => {
        const sapiItems = items.filter((item) => item.status.toLowerCase().includes("sapi"));

        if (sapiItems.length === 0) return;

        result[groupId] = sapiItems;
      });

      return result;
    })(),
  );

  const searchResults = $derived(
    (() => {
      if (!query.trim()) return [];

      const result: {
        name: string;
        groupId: string;
        info: string;
        status: string;
      }[] = [];

      Object.entries(grouped).forEach(([groupId, items]) => {
        const info = getGroupInfo(items);

        items.forEach((item) => {
          if (item.name.toLowerCase().includes(query.toLowerCase())) {
            result.push({
              name: item.name,
              groupId,
              info,
              status: item.status,
            });
          }
        });
      });

      return result;
    })(),
  );

  // 🧠 Detect group info (label)
  function getGroupInfo(items: DataType[]) {
    const statuses = items.map((i) => i.status.toLowerCase());

    if (statuses.some((s) => s.includes("non"))) return "(Non-Kolektif)";
    if (statuses.some((s) => s.includes("kolektif"))) return "(Kolektif)";
    if (statuses.some((s) => s.includes("titip"))) return "(Titip)";

    return "";
  }

  // 🎨 Icons
  const categoryIcon: Record<string, string> = {
    "Sapi Kolektif": "🐂",
    "Sapi Non-Kolektif": "🐄",
    "Titip Sapi": "📦🐂",
    "Titip Kambing": "📦🐐",
    Lainnya: "📦",
  };
</script>

<div class="flex justify-center">
  <div class="flex flex-col gap-2 p-4 max-w-xl w-full">
    <img alt="logo" src="/preview.png" class="w-3/5 m-auto mb-4" />

    <h1 class="text-center font-bold text-xl mb-2">List pendaftaran hewan qurban 1447 H</h1>

    <!-- ✅ Summary -->
    <span class="text-center font-semibold text-md mb-2">
      Total peserta: {summary.totalPeserta} - {summary.totalSapi} Sapi, {summary.totalKambing} Kambing
    </span>

    <div>
      <h2 class="font-bold mb-4">📝 Form Pendaftaran</h2>

      <a href="https://forms.gle/7re1fWNqy3FsKVj39">
        <button
          class="mb-2 p-2 w-full border rounded-md hover:cursor-pointer bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
        >
          Klik disini untuk daftar
        </button>
      </a>
    </div>

    <div class="mt-4">
      <h2 class="font-bold">📋 Daftar Peserta Qurban 1447H</h2>
      <!-- 🔍 Search -->
      <input
        type="text"
        class="my-4 p-2 w-full border rounded-md"
        placeholder="Cari nama..."
        bind:value={query}
      />

      {#if query.trim()}
        <!-- 🔍 SEARCH MODE -->
        <div class="mb-6">
          <h2 class="font-bold text-lg mb-2">🔍 Hasil pencarian</h2>

          {#if searchResults.length === 0}
            <p class="text-gray-500">Nama tidak ditemukan</p>
          {:else}
            <ul class="list-disc ml-2 space-y-2">
              {#each searchResults as item}
                <li>
                  {item.name}

                  <span class="ml-2 font-bold">
                    {#if item.status.toLowerCase().includes("titip kambing")}
                      (Titip Kambing)
                    {:else if item.groupId !== "-"}
                      (Sapi No. {item.groupId} - {item.info})
                    {:else}
                      (⏳ Menunggu konfirmasi nomor urut sapi...)
                    {/if}
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {:else}
        <!-- 🧾 NORMAL MODE (your existing UI stays unchanged) -->

        <!-- 🐂 SAPI (MERGED) -->
        <div class="mb-6">
          <h2 class="font-bold text-lg mb-2">🐂 Sapi</h2>

          {#each Object.entries(sapiGroups) as [groupId, items]}
            {@const info = getGroupInfo(items)}
            <div class="mb-4">
              {#if groupId === "-"}
                <h3 class="font-semibold text-gray-600">
                  ⏳ Menunggu konfirmasi nomor urut sapi...
                </h3>
              {:else}
                <h3 class="font-semibold">
                  🐂 Sapi No. {groupId}
                  {info}
                </h3>
              {/if}

              <ul class="ml-2">
                {#each items as item, i}
                  <li>
                    {groupId === "-" ? "" : i + 1} - {item.name}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>

        <!-- 🐐 OTHER CATEGORIES -->
        {#each sortedCategories.filter(([category]) => !category
              .toLowerCase()
              .includes("sapi")) as [category, groups]}
          {@const kambingList = Object.values(groups).flat()}

          <div class="mb-6">
            <h2 class="font-bold text-lg mb-2">
              {categoryIcon[category] || "📦"}
              {category}
            </h2>

            <ul class="ml-2 mb-4">
              {#each kambingList as item, i}
                <li>{i + 1} - {item.name}</li>
              {/each}
            </ul>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
