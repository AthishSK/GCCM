<script>
    import { onMount } from "svelte";
    import { createTag, fetchRepoTags, fetchRepoBranches } from "../lib/api.js";
    import { createEventDispatcher } from "svelte";

    export let selectedRepo;
    let tagName = "";
    let refBranch = "";
    let message = "";
    let responseMessage = "";
    let branches = []; // Store all available branches

    const dispatch = createEventDispatcher();

    // Fetch available branches on mount
    async function loadBranches() {
        if (selectedRepo) {
            branches = await fetchRepoBranches(selectedRepo);
        }
    }

    onMount(loadBranches);

    async function handleCreateTag() {
        if (!tagName || !refBranch) {
            responseMessage = "❗ Tag Name and Reference Branch are required!";
            return;
        }

        try {
            await createTag(selectedRepo, tagName, refBranch, message);
            responseMessage = "✅ Tag created successfully!";

            // Fetch updated tags and notify parent component
            const updatedTags = await fetchRepoTags(selectedRepo);
            dispatch("tagCreated", updatedTags);

            // Reload branches in case new ones were created
            await loadBranches();

            // Clear fields
            tagName = "";
            refBranch = "";
            message = "";
        } catch (error) {
            responseMessage = "❌ Error creating tag: " + error.message;
        }
    }
</script>

<div class="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Create a New Tag</h3>

    <div class="mb-4">
        <label for="tagName" class="block text-gray-700 font-semibold mb-2">Tag Name</label>
        <input id="tagName" type="text" bind:value={tagName} placeholder="Enter tag name..." class="input-field" />
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

    <div class="mb-4">
        <label for="message" class="block text-gray-700 font-semibold mb-2">Message (Optional)</label>
        <textarea id="message" bind:value={message} placeholder="Enter tag message..." class="input-field"></textarea>
    </div>

    <button on:click={handleCreateTag} class="btn w-full">Create Tag</button>

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