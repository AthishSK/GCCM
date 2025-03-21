<script>
    import { onMount } from "svelte";
    import { fetchRepoBranches } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let branches = [];

    onMount(async () => {
        if (selectedRepo) {
            branches = await fetchRepoBranches(selectedRepo);
        }
    });
</script>

<DataTable title="Branches" data={branches} fields={["name"]} />
