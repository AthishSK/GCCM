<script>
    import { onMount } from "svelte";
    import { fetchRepoMergeRequests } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let mergeRequests = [];

    onMount(async () => {
        if (selectedRepo) {
            mergeRequests = await fetchRepoMergeRequests(selectedRepo);
        }
    });
</script>

<DataTable title="Merge Requests" data={mergeRequests} fields={["title", "state", "author.name"]} />
