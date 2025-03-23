<script>
    import { onMount } from "svelte";
    import { fetchCommitChanges, fetchRepoCommits } from "../lib/api.js";
    
    export let projectId;
    export let commitSha;
    
    let commitChanges = [];
    let commitInfo = null;
    let loading = true;
    let error = null;
    
    onMount(async () => {
        try {
            loading = true;
            
            // Fetch commit details
            const commits = await fetchRepoCommits(projectId);
            commitInfo = commits.find(c => c.id === commitSha);
            
            // Fetch commit changes
            commitChanges = await fetchCommitChanges(projectId, commitSha);
            
            loading = false;
        } catch (err) {
            error = "Failed to load commit changes: " + err.message;
            loading = false;
        }
    });
    
    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString();
    }
</script>

<style>
    .added {
        background-color: #d4f8d4;
        color: #1a7f1a;
    }
    .removed {
        background-color: #f8d4d4;
        color: #7f1a1a;
    }
    .code-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        overflow-x: auto;
    }
    .code-box {
        font-family: monospace;
        font-size: 0.875rem;
        padding: 1rem;
        white-space: pre-wrap;
        word-break: break-word;
        background: #f9f9f9;
        border-radius: 4px;
        border: 1px solid #ddd;
    }
</style>

<div class="bg-white shadow-xl rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Commit Changes</h2>
    
    {#if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
        </div>
    {:else if loading}
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    {:else if commitInfo}
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500">Commit:</p>
                    <p class="font-mono text-gray-800">{commitInfo.id}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Author:</p>
                    <p class="text-gray-800">{commitInfo.author_name} &lt;{commitInfo.author_email}&gt;</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Date:</p>
                    <p class="text-gray-800">{formatDate(commitInfo.created_at)}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Message:</p>
                    <p class="text-gray-800">{commitInfo.title}</p>
                </div>
            </div>
        </div>
        
        {#if commitChanges.length === 0}
            <div class="text-center py-10 text-gray-500">
                No changes found in this commit.
            </div>
        {:else}
            {#each commitChanges as change}
                <div class="mb-8">
                    <div class="flex justify-between items-center bg-gray-100 p-3 rounded-t-lg">
                        <h3 class="font-medium text-gray-800">{change.new_path}</h3>
                        <span class="text-sm text-gray-500">
                            {#if change.new_file}
                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">New File</span>
                            {:else if change.deleted_file}
                                <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Deleted File</span>
                            {:else if change.renamed_file}
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Renamed File</span>
                            {:else}
                                <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Modified File</span>
                            {/if}
                        </span>
                    </div>
                    <div class="code-container p-4">
                        <div class="code-box">
                            <p class="text-sm font-bold text-red-600">Removed</p>
                            {#each change.diff.split('\n') as line}
                                {#if line.startsWith('-')}
                                    <span class="removed">{line}</span><br>
                                {/if}
                            {/each}
                        </div>
                        <div class="code-box">
                            <p class="text-sm font-bold text-green-600">Added</p>
                            {#each change.diff.split('\n') as line}
                                {#if line.startsWith('+')}
                                    <span class="added">{line}</span><br>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    {:else}
        <div class="text-center py-10 text-gray-500">
            Commit not found.
        </div>
    {/if}
</div>