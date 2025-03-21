<script>
    import { onMount } from "svelte";
    import { fetchRepoTags } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let tags = [];

    function formatISTDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", { 
            timeZone: "Asia/Kolkata",
            year: "numeric", 
            month: "long", 
            day: "numeric",
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit"
        });
    }

    onMount(async () => {
        if (selectedRepo) {
            const rawTags = await fetchRepoTags(selectedRepo);
            tags = rawTags.map(tag => ({
                ...tag,
                created_at: formatISTDate(tag.created_at) // Convert to IST format
            }));
        }
    });
</script>

<DataTable title="Tags" data={tags} fields={["name", "commit.short_id", "created_at"]} />
