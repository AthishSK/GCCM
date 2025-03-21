<script>
    import { onMount } from "svelte";
    import { fetchRepoCommits } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let commits = [];

    function formatISTDate(dateString) {
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
            const rawCommits = await fetchRepoCommits(selectedRepo);
            commits = rawCommits.map(commit => ({
                ...commit,
                created_at: formatISTDate(commit.created_at) // Convert to IST
            }));
        }
    });
</script>

<DataTable title="Commits" data={commits} fields={["message", "author_name", "created_at"]} />
