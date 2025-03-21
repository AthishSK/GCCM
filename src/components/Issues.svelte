<script>
    import { onMount, afterUpdate } from "svelte";
    import { fetchRepoIssues } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let issues = [];

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

    async function loadIssues() {
        if (selectedRepo) {
            const rawIssues = await fetchRepoIssues(selectedRepo);
            issues = rawIssues.map(issue => ({
                ...issue,
                created_at: formatISTDate(issue.created_at) // Convert to IST format
            }));
        }
    }

    onMount(loadIssues);
    afterUpdate(loadIssues);
</script>

<DataTable title="Issues" data={issues} fields={["title", "state", "description", "created_at"]} />
