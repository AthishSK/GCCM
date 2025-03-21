<script>
    import { onMount } from "svelte";
    import { createCommit, fetchRepoBranches } from "../lib/api.js";

    export let selectedRepo; // Receive project ID

    let commitMessage = "";
    let branchName = "";
    let filePath = "";
    let fileContent = "";
    let branches = []; // Store available branches

    // Fetch branches when component mounts
    async function loadBranches() {
        if (!selectedRepo) return;
        try {
            branches = await fetchRepoBranches(selectedRepo);
            if (branches.length > 0) {
                branchName = branches[0].name; // Set first branch as default
            }
        } catch (error) {
            console.error("❌ Error fetching branches:", error);
            alert("Failed to fetch branches.");
        }
    }

    onMount(loadBranches);

    async function handleCommit() {
        if (!selectedRepo || !commitMessage || !branchName || !filePath || !fileContent) {
            alert("Please fill all fields.");
            return;
        }

        const actions = [
            {
                action: "create",
                file_path: filePath,
                content: fileContent
            }
        ];

        console.log("🚀 Sending commit request with:", {
            project_id: selectedRepo,
            branch: branchName,
            commit_message: commitMessage,
            actions
        });

        try {
            const response = await createCommit(selectedRepo, branchName, commitMessage, actions);
            alert("✅ Commit created successfully!");
            console.log("🔹 GitLab API Response:", response);
        } catch (error) {
            console.error("❌ Commit failed:", error);
            alert("Commit failed. Check the console for more details.");
        }
    }
</script>

<div class="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Create Commit</h3>

    <!-- Branch Selection Dropdown -->
    <div class="mb-4">
        <label for="branch" class="block text-gray-700 font-semibold mb-2">Select Branch</label>
        <select id="branch" bind:value={branchName} class="input-field">
            {#each branches as branch}
                <option value={branch.name}>{branch.name}</option>
            {/each}
        </select>
    </div>

    <div class="mb-4">
        <label for="commitMessage" class="block text-gray-700 font-semibold mb-2">Commit Message</label>
        <input id="commitMessage" type="text" bind:value={commitMessage} placeholder="Enter commit message..." class="input-field" />
    </div>

    <div class="mb-4">
        <label for="filePath" class="block text-gray-700 font-semibold mb-2">File Path</label>
        <input id="filePath" type="text" bind:value={filePath} placeholder="e.g., src/index.js" class="input-field" />
    </div>

    <div class="mb-4">
        <label for="fileContent" class="block text-gray-700 font-semibold mb-2">File Content</label>
        <textarea id="fileContent" bind:value={fileContent} placeholder="Enter file content..." class="input-field"></textarea>
    </div>

    <button on:click={handleCommit} class="btn w-full">Create Commit</button>
</div>

<style>
    .input-field {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        border: 2px solid #ddd;
        border-radius: 8px;
        background: white;
        transition: all 0.3s ease-in-out;
    }

    .input-field:focus {
        border-color: #f12711;
        box-shadow: 0 0 10px rgba(241, 39, 17, 0.3);
        outline: none;
    }

    .btn {
        background: linear-gradient(135deg, #5146f0, #79a6f4);
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
