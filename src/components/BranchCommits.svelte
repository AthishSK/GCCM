<script>
    import { onMount } from "svelte";
    import { fetchRepoBranches, fetchBranchCommits, cherryPickCommit, fetchCommitChanges, fetchLatestMergeRequest } from "../lib/api.js";    
    export let selectedRepo;
    
    let branches = [];
    let commits = [];
    let selectedBranch = "";
    let loading = false;
    let error = null;
    let cherryPickLoading = false;
    let cherryPickError = null;
    let cherryPickSuccess = false;
    let showCherryPickDialog = false;
    let selectedCommitForCherryPick = null;
    let targetBranchForCherryPick = "";
    let showChangesPreview = false;
    let commitChanges = [];
    
    onMount(async () => {
        try {
            loading = true;
            branches = await fetchRepoBranches(selectedRepo);
            loading = false;
        } catch (err) {
            error = "Failed to load branches: " + err.message;
            loading = false;
        }
    });
    
    async function handleBranchChange() {
        if (!selectedBranch) return;
        
        try {
            loading = true;
            commits = await fetchBranchCommits(selectedRepo, selectedBranch);
            loading = false;
        } catch (err) {
            error = "Failed to load commits: " + err.message;
            loading = false;
            commits = [];
        }
    }
    
    async function handleCherryPick(commit) {
        selectedCommitForCherryPick = commit;
        // Don't default to the current branch, as cherry-picking to the same branch doesn't make sense
        targetBranchForCherryPick = "";
        showCherryPickDialog = true;
        // Fetch changes for preview
        try {
            commitChanges = await fetchCommitChanges(selectedRepo, commit.id);
        } catch (err) {
            console.error("Error fetching commit changes:", err);
            commitChanges = [];
        }
    }
    
    async function confirmCherryPick() {
        if (!selectedCommitForCherryPick || !targetBranchForCherryPick) {
            cherryPickError = "Please select both a commit and a target branch";
            return;
        }
        
        // Don't allow cherry-picking to the same branch
        if (targetBranchForCherryPick === selectedBranch) {
            cherryPickError = "Cannot cherry-pick to the same branch. Please select a different target branch.";
            return;
        }

        try {
            console.log("Starting cherry-pick operation...");
            console.log("Project ID:", selectedRepo);
            console.log("Commit SHA:", selectedCommitForCherryPick.id);
            console.log("Target Branch:", targetBranchForCherryPick);
            
            cherryPickLoading = true;
            cherryPickError = null;
            cherryPickSuccess = false;
            
            const result = await cherryPickCommit(
                selectedRepo, 
                selectedCommitForCherryPick.id, 
                targetBranchForCherryPick
            );
            
            console.log("Cherry-pick result:", result);
            
            cherryPickSuccess = true;
            // Keep dialog open to show success message
            setTimeout(() => {
                showCherryPickDialog = false;
                // Reset success message after dialog closes
                setTimeout(() => {
                    cherryPickSuccess = false;
                }, 300);
            }, 2000);
        } catch (err) {
            console.error("Cherry-pick error:", err);
            let errorMessage = "Failed to cherry-pick commit: ";
            
            if (typeof err.message === 'string') {
                if (err.message.includes("already exists") || err.message.includes("already been done")) {
                    errorMessage = "This commit cannot be cherry-picked automatically because:\n" +
                        "1. The changes may already exist in the target branch, or\n" +
                        "2. There are conflicts that need to be resolved manually\n\n" +
                        "Please check the changes below and consider:\n" +
                        "- Creating a new branch and applying changes manually\n" +
                        "- Using GitLab's web interface to resolve conflicts\n" +
                        "- Checking if the changes are already present in the target branch";
                } else if (err.message.includes("conflict")) {
                    errorMessage = "There are conflicts that need to be resolved manually. Please:\n" +
                        "1. Create a new branch from the target branch\n" +
                        "2. Apply the changes manually\n" +
                        "3. Resolve any conflicts\n" +
                        "4. Create a merge request with the changes";
                } else {
                    errorMessage += err.message;
                }
            } else {
                errorMessage += "Unknown error occurred";
            }
            
            cherryPickError = errorMessage;
        } finally {
            cherryPickLoading = false;
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    function viewCommitChanges(commitSha) {
        // Update the view in Main.svelte by dispatching an event
        const event = new CustomEvent('viewcommitchanges', {
            detail: { projectId: selectedRepo, commitSha }
        });
        window.dispatchEvent(event);
    }
    
    function closeDialog() {
        showCherryPickDialog = false;
        cherryPickError = null;
        cherryPickSuccess = false;
    }

    function viewTargetBranchChanges(branchName) {
        // Change the selected branch to the target branch
        selectedBranch = branchName;
        // Close the dialog
        closeDialog();
        // Load the commits for the target branch
        handleBranchChange();
    }

    function viewMergeRequest(projectId, targetBranch) {
        // This would need to be implemented based on your GitLab API
        fetchLatestMergeRequest(projectId, targetBranch)
            .then(mrId => {
                if (mrId) {
                    // Open the merge request in a new tab
                    const gitlabBaseUrl = "https://gitlab.com"; // Replace with your GitLab instance URL
                    window.open(`${gitlabBaseUrl}/${projectId}/merge_requests/${mrId}`, '_blank');
                } else {
                    // Display a message if no merge request was found
                    alert("No merge request found for this cherry-pick operation.");
                }
            })
            .catch(err => {
                console.error("Error fetching merge request:", err);
                alert("Could not retrieve merge request information.");
            });
            
        // Close the dialog after attempting to open the MR
        closeDialog();
    }
</script>

<div class="bg-white shadow-xl rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Branch Commits</h2>
    
    {#if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
        </div>
    {/if}
    
    <div class="mb-6">
        <label for="branch-select" class="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
        <select 
            id="branch-select" 
            bind:value={selectedBranch} 
            on:change={handleBranchChange}
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
        >
            <option value="">-- Select a Branch --</option>
            {#each branches as branch}
                <option value={branch.name}>{branch.name}</option>
            {/each}
        </select>
    </div>
    
    {#if loading}
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    {:else if commits.length > 0}
        <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each commits as commit}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{commit.short_id}</div>
                                <div class="text-sm text-gray-500 truncate max-w-xs">{commit.title}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{commit.author_name}</div>
                                <div class="text-sm text-gray-500">{commit.author_email}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(commit.created_at)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button 
                                        on:click={() => viewCommitChanges(commit.id)} 
                                        class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md inline-flex items-center"
                                        title="View Changes"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </button>
                                    <button 
                                        on:click={() => handleCherryPick(commit)}
                                        disabled={cherryPickLoading}
                                        class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Cherry-Pick Commit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                        Cherry-Pick
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else if selectedBranch}
        <div class="bg-blue-50 p-6 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-700">No commits found in this branch.</p>
        </div>
    {/if}

    {#if showCherryPickDialog}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold">
                        {cherryPickSuccess ? 'Cherry-Pick Successful' : 'Confirm Cherry-Pick'}
                    </h3>
                    <button on:click={closeDialog} class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {#if cherryPickSuccess}
                    <div class="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p class="font-semibold">Cherry-pick successful!</p>
                                <p class="mt-1">Commit {selectedCommitForCherryPick?.short_id} has been cherry-picked to <span class="font-semibold">{targetBranchForCherryPick}</span></p>
                                
                                <!-- Add details about what happened (this would need to be returned from your API) -->
                                <div class="mt-2 text-sm">
                                    <p>• The changes have been directly applied to the target branch.</p>
                                    <!-- OR, depending on your Git workflow -->
                                    <!-- <p>• A merge request has been created for these changes.</p> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Add action buttons for post-cherry-pick actions -->
                    <div class="mt-4 flex flex-col space-y-2">
                        <button 
                            on:click={() => viewTargetBranchChanges(targetBranchForCherryPick)}
                            class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Changes in {targetBranchForCherryPick}
                        </button>
                        
                        <!-- If your workflow creates merge requests instead of direct merges -->
                        <button 
                            on:click={() => viewMergeRequest(selectedRepo, targetBranchForCherryPick)}
                            class="text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 py-2 px-4 rounded-lg flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            View Merge Request
                        </button>
                    </div>
                {:else}
                    <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <div class="text-sm font-medium text-gray-800">Commit: <span class="font-mono">{selectedCommitForCherryPick?.short_id}</span></div>
                                <div class="text-sm text-gray-600 mt-1">{selectedCommitForCherryPick?.title}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Target Branch</label>
                        <select 
                            bind:value={targetBranchForCherryPick}
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={cherryPickLoading}
                        >
                            <option value="">Select target branch</option>
                            {#each branches.filter(branch => branch.name !== selectedBranch) as branch}
                                <option value={branch.name}>{branch.name}</option>
                            {/each}
                        </select>
                    </div>

                    {#if commitChanges.length > 0}
                        <div class="mb-6">
                            <button 
                                on:click={() => showChangesPreview = !showChangesPreview}
                                class="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {#if showChangesPreview}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    {:else}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    {/if}
                                </svg>
                                {showChangesPreview ? 'Hide Changes' : 'Show Changes'}
                            </button>
                            
                            {#if showChangesPreview}
                                <div class="mt-2 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                                    <h4 class="font-medium mb-3 text-gray-700">Changes in this commit:</h4>
                                    {#each commitChanges as change}
                                        <div class="mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                                            <div class="flex items-center">
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-gray-700">{change.new_path || change.old_path}</div>
                                                </div>
                                                <div class="ml-2">
                                                    {#if change.new_file}
                                                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">New File</span>
                                                    {:else if change.deleted_file}
                                                        <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Deleted</span>
                                                    {:else if change.renamed_file}
                                                        <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Renamed</span>
                                                    {:else}
                                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Modified</span>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}

                    {#if cherryPickError}
                        <div class="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded whitespace-pre-line" role="alert">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p>{cherryPickError}</p>
                            </div>
                        </div>
                    {/if}
                    
                    <div class="flex justify-end space-x-3 mt-6">
                        <button 
                            on:click={closeDialog}
                            class="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={cherryPickLoading}
                        >
                            Cancel
                        </button>
                        
                        <button 
                            on:click={confirmCherryPick}
                            class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                            disabled={cherryPickLoading || !targetBranchForCherryPick}
                        >
                            {#if cherryPickLoading}
                                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            {/if}
                            Cherry-Pick to {targetBranchForCherryPick || "Selected Branch"}
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>