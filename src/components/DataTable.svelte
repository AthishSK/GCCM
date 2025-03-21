<script>
    export let title = "";
    export let data = [];
    export let fields = [];
</script>

<div class="bg-white shadow-md rounded-lg p-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
    
    {#if data.length === 0}
        <p class="text-gray-500">No data available.</p>
    {:else}
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr class="bg-gray-100 text-gray-700">
                        {#each fields as field}
                            <th class="px-4 py-2 border">{field}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each data as item}
                        <tr class="border-b">
                            {#each fields as field}
                                <td class="px-4 py-2 border">{item[field]}</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
