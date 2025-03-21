<script>
    import { onMount } from "svelte";
    import { createMergeRequest, fetchRepoBranches } from "../lib/api.js";
    import { theme } from "../lib/stores/theme.js";
    import { API_BASE_URL } from "$lib/config.js";

    export let selectedRepo;
    let title = "";
    let description = "";
    let sourceBranch = "";
    let targetBranch = "";
    let branches = [];
    let loading = false;
    let error = null;
    let success = false;

    onMount(async () => {
        try {
            if (!selectedRepo) {
                error = 'No repository selected';
                return;
            }
            // Fetch branches using the GitLab API
            branches = await fetchRepoBranches(selectedRepo);
            if (!branches) {
                throw new Error('Failed to load branches');
            }
        } catch (err) {
            console.error('Error fetching branches:', err);
            error = err.message || 'Failed to load branches';
        }
    });

    // Watch for changes in selectedRepo
    $: if (selectedRepo) {
        // Reset form when repository changes
        title = "";
        description = "";
        sourceBranch = "";
        targetBranch = "";
        error = null;
        success = false;
        // Fetch branches for the new repository
        fetchRepoBranches(selectedRepo)
            .then(data => {
                branches = data;
                error = null;
            })
            .catch(err => {
                console.error('Error fetching branches:', err);
                error = 'Failed to load branches';
            });
    }

    async function handleSubmit() {
        loading = true;
        error = null;
        success = false;

        try {
            await createMergeRequest(selectedRepo, sourceBranch, targetBranch, title);
            success = true;
            // Reset form
            title = "";
            description = "";
            sourceBranch = "";
            targetBranch = "";
        } catch (err) {
            console.error('Error creating merge request:', err);
            error = err.message || 'Failed to create merge request';
        } finally {
            loading = false;
        }
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-black">Create New Merge Request</h2>
    </div>

    {#if error}
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
        </div>
    {/if}

    {#if success}
        <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Merge request created successfully!
        </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
            <label for="title" class="block text-sm font-medium text-black mb-1">Title</label>
            <input
                type="text"
                id="title"
                bind:value={title}
                required
                class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter merge request title"
            />
        </div>

        <div>
            <label for="description" class="block text-sm font-medium text-black mb-1">Description</label>
            <textarea
                id="description"
                bind:value={description}
                required
                rows="4"
                class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter merge request description"
            ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="sourceBranch" class="block text-sm font-medium text-black mb-1">Source Branch</label>
                <select
                    id="sourceBranch"
                    bind:value={sourceBranch}
                    required
                    class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select source branch</option>
                    {#each branches as branch}
                        <option value={branch.name}>{branch.name}</option>
                    {/each}
                </select>
            </div>

            <div>
                <label for="targetBranch" class="block text-sm font-medium text-black mb-1">Target Branch</label>
                <select
                    id="targetBranch"
                    bind:value={targetBranch}
                    required
                    class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select target branch</option>
                    {#each branches as branch}
                        <option value={branch.name}>{branch.name}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                disabled={loading}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating...' : 'Create Merge Request'}
            </button>
        </div>
    </form>
</div>

<style>
    /* Add glassmorphism effect */
    input, textarea, select {
        transition: all 0.2s ease-in-out;
    }

    /* Add hover effects */
    input:hover, textarea:hover, select:hover {
        border-color: #94a3b8;
    }

    /* Enhance transitions */
    * {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
    }
</style>