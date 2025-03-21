<script>
    import { onMount } from "svelte";
    import { CreateIssues } from "../lib/api.js";
    import DataTable from "./DataTable.svelte";

    export let selectedRepo;
    let issueTitle = "";
    let issueDescription = "";

    async function submitIssue() {
        if (!issueTitle || !issueDescription) {
            alert("Please provide both title and description.");
            return;
        }
        try {
            await CreateIssues(selectedRepo, issueTitle, issueDescription);
            alert("Issue created successfully!");
            issueTitle = "";
            issueDescription = "";
        } catch (error) {
            alert("Error creating issue.");
            console.error("Issue creation failed:", error);
        }
    }
</script>

<div class="bg-white shadow-lg rounded-lg p-6 mt-6">
    <h3 class="text-xl font-bold mb-3 text-gray-700">Create a New Issue</h3>
    <input type="text" placeholder="Issue Title" bind:value={issueTitle} class="border p-2 w-full mt-2" />
    <textarea placeholder="Issue Description" bind:value={issueDescription} class="border p-2 w-full mt-2"></textarea>
    <button class="btn mt-3" on:click={submitIssue}>Submit Issue</button>
</div>

<style>
    .btn {
        background: linear-gradient(135deg, #2f2cf1, #619ef3);
        color: white;
        padding: 0.8rem;
        border-radius: 8px;
        font-weight: 700;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }
</style>
