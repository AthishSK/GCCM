<script>
    import { onMount } from "svelte";
    import { createBranch, fetchRepoBranches } from "../lib/api.js";
    import { createEventDispatcher } from "svelte";

    export let selectedRepo;
    let branchName = "";
    let refBranch = "";
    let branches = [];
    let responseMessage = "";
    const dispatch = createEventDispatcher();

    // Fetch branches when component mounts
    async function loadBranches() {
        try {
            branches = await fetchRepoBranches(selectedRepo);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    }

    async function handleCreateBranch() {
        if (!branchName || !refBranch) {
            responseMessage = "❗ Branch Name and Reference Branch are required!";
            return;
        }

        try {
            await createBranch(selectedRepo, branchName, refBranch);
            responseMessage = "✅ Branch created successfully!";

            // Fetch updated branches and notify parent component
            const updatedBranches = await fetchRepoBranches(selectedRepo);
            dispatch("branchCreated", updatedBranches);

            // Clear fields
            branchName = "";
            refBranch = "";
        } catch (error) {
            responseMessage = "❌ Error creating branch: " + error.message;
        }
    }

    // Load branches when component is mounted
    onMount(loadBranches);
</script>

<div class="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Create a New Branch</h3>

    <div class="mb-4">
        <label for="branchName" class="block text-gray-700 font-semibold mb-2">Branch Name</label>
        <input id="branchName" type="text" bind:value={branchName} placeholder="Enter branch name..." class="input-field" />
    </div>

    <div class="mb-4">
        <label for="refBranch" class="block text-gray-700 font-semibold mb-2">Reference Branch</label>
        <select id="refBranch" bind:value={refBranch} class="input-field">
            <option value="" disabled selected>Select a reference branch</option>
            {#each branches as branch}
                <option value={branch.name}>{branch.name}</option>
            {/each}
        </select>
    </div>

    <button on:click={handleCreateBranch} class="btn w-full">Create Branch</button>

    {#if responseMessage}
        <p class="mt-4 text-center text-lg font-semibold text-gray-700">{responseMessage}</p>
    {/if}
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
        border-color: #2575fc;
        box-shadow: 0 0 10px rgba(37, 117, 252, 0.3);
        outline: none;
    }

    .btn {
        background: linear-gradient(135deg, #324fe1, #6e9ded);
        color: white;
        padding: 0.8rem;
        border-radius: 8px;
        font-weight: 700;
    }

    .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }
</style>
