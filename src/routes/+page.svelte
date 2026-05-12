<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { filterByName, getDate, getSummary } from "$lib/utils";

  let { data } = $props();

  let participant = $derived(data.grouped);
  let query = $state("");
  let heroEl = $state<HTMLDivElement>();
  let inputEl = $state<HTMLInputElement>();

  const date = getDate();
  const summary = $derived(getSummary(data));

  const categoryLabel: Record<string, string> = {
    Sapi: "🐂 Sapi",
    Kambing: "🐐 Kambing",
  };

  function focusInput() {
    if (inputEl && heroEl) {
      window.scrollTo({
        top: heroEl.getBoundingClientRect().bottom,
        behavior: "smooth",
      });

      inputEl.focus();
    }
  }

  $effect(() => {
    if (query) {
      participant = filterByName(data.grouped, query);
    } else {
      participant = data.grouped;
    }
  });
</script>

<!-- Hero section start -->
<div bind:this={heroEl} class="bg-hero relative w-full">
  <div class="flex flex-col gap-5 p-6 max-w-xl mx-auto text-center text-white">
    <!-- Logo -->
    <img alt="logo" src="/logo_blank.svg" class="w-96 md:w-full mx-auto opacity-90" />

    <p class="text-center text-xs sm:text-md md:text-lg">
      "Dan bagi tiap-tiap umat telah kami syariatkan penyembelihan (qurban) supaya mereka menyebut
      nama Allah terhadap binatang ternak yang telah direzekikan Allah kepada mereka."
      <br />
      (QS. Al-Hajj: 34)
    </p>

    <!-- CTA -->
    <div class="flex flex-col w-full justify-center sm:flex-row gap-2">
      <Button href="https://forms.gle/7re1fWNqy3FsKVj39">Klik Disini Untuk Mendaftar</Button>
      <Button variant="outline" onclick={focusInput}>Lihat daftar peserta</Button>
    </div>

    <!-- Summary -->
    <div class="bg-white rounded-xl text-hero p-4">
      <span class="text-md font-bold">Total Pendaftar hari ini, {date}</span>

      <div class="mt-4 flex justify-evenly text-sm font-medium">
        <div>
          <p class="text-4xl font-bold">{summary.peserta}</p>
          <p class="text-xl opacity-80">Peserta</p>
        </div>

        <div>
          <p class="text-4xl font-bold">{summary.sapi}</p>
          <p class="text-xl opacity-80">Sapi</p>
        </div>

        <div>
          <p class="text-4xl font-bold">{summary.kambing}</p>
          <p class="text-xl opacity-80">Kambing</p>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Hero section end -->

<div class="relative flex justify-center">
  <div class="flex flex-col gap-2 p-4 max-w-xl w-xl justify-center">
    <div class="mt-4">
      <h2 class="font-bold">📋 Daftar Peserta Qurban 1447H</h2>
      <!-- 🔍 Search -->
      <input
        bind:this={inputEl}
        type="text"
        class="my-4 p-2 w-full border rounded-md"
        placeholder="Cari nama..."
        bind:value={query}
      />

      <div class="mb-6">
        {#each Object.entries(participant) as [category, value]}
          {#each Object.entries(value) as [id, users]}
            {@const isKambing = category.includes("Kambing")}

            <div class="mb-4">
              {#if !isKambing && id === "-"}
                <h3 class="font-semibold text-gray-600">
                  ⏳ Menunggu konfirmasi nomor urut sapi...
                </h3>
              {:else}
                <h3 class="font-semibold">
                  {categoryLabel[category] || "📦"}
                  {!isKambing ? `No. ${id}` : ""}
                </h3>
              {/if}

              <ul class="ml-2">
                {#each users as user, i}
                  <li class="flex flex-wrap gap-2 items-center">
                    {isKambing || id !== "-" ? i + 1 : ""} - {user.name}

                    {#if user.payment === "Lunas"}
                      <span>✅</span>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        {/each}
      </div>
    </div>
  </div>
</div>

<div class="bg-hero w-full py-1.5 flex justify-center items-center text-white text-xs">
  Al-Ikhlash 2026 | Crafted by @septiandch
</div>
