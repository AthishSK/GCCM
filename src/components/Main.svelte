<script>
    import { onMount } from "svelte";
    import { fetchGitLabRepos, fetchRepoDetails } from "../lib/api.js";
    import Issues from "./Issues.svelte";
    import Commits from "./Commits.svelte";
    import Branches from "./Branches.svelte";
    import MergeRequests from "./MergeRequests.svelte";
    import Tags from "./Tags.svelte";
    import CreateIssues from "./CreateIssues.svelte";
    import CreateTags from "./CreateTags.svelte";
    import CreateBranch from "./CreateBranch.svelte";
    import CommitMergeForm from './CommitMergeForm.svelte';
    import CommitForm from "./CommitForm.svelte";
    import MergeRequestForm from "./MergeRequestForm.svelte";
    import BranchCommits from "./BranchCommits.svelte";
    import CommitChanges from "./CommitChanges.svelte";

    let repos = [];
    export let selectedRepo = null;
    let repoDetails = {};
    let view = "";
    let commitDetailsView = false;
    let commitDetailsData = { projectId: null, commitSha: null };

    onMount(async () => {
        try {
            repos = await fetchGitLabRepos();
            
            window.addEventListener('viewcommitchanges', (event) => {
                commitDetailsView = true;
                commitDetailsData = event.detail;
                view = "";
            });
        } catch (error) {
            console.error("Failed to fetch repositories:", error);
        }
    });

    async function selectRepo(event) {
        selectedRepo = event.target.value;
        view = "";
        commitDetailsView = false;
        repoDetails = await fetchRepoDetails(selectedRepo);
    }

    function goBackToCommits() {
        commitDetailsView = false;
        view = "branchCommits";
    }
</script>

    <div class="flex h-screen bg-white text-black">
        <!-- Top Navigation Bar -->
        <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50">
            <div class="flex items-center space-x-4">
                <h1 class="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Repository Manager
                </h1>
                <select id="repo-select" on:change={selectRepo} class="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900">
                    <option value="">Select Repository</option>
                {#each repos as repo}
                    <option value={repo.id}>{repo.name}</option>
                {/each}
            </select>
        </div>
    </header>

    <!-- Sidebar - Only visible when repository is selected -->
    {#if selectedRepo}
        <aside class="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
            <nav class="p-4 space-y-1">
                <button on:click={() => { view = "issues"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Issues
                </button>
                <button on:click={() => { view = "commits"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Commits
                </button>
                <button on:click={() => { view = "branches"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                    </svg>
                    Branches
                </button>
                <button on:click={() => { view = "mergeRequests"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    Merge Requests
                </button>
                <button on:click={() => { view = "tags"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    Tags
                </button>
                <div class="border-t border-slate-200 my-4"></div>
                <button on:click={() => { view = "createIssue"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    New Issue
                </button>
                <button on:click={() => { view = "createTag"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    New Tag
                </button>
                <button on:click={() => { view = "createBranch"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    New Branch
                </button>
                <button on:click={() => { view = "createCommit"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    New Commit
                </button>
                <button on:click={() => { view = "createMergeRequest"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    New Merge Request
                </button>
                <button on:click={() => { view = "branchCommits"; commitDetailsView = false; }} class="nav-item">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Branch Commits
                </button>
            </nav>
        </aside>
    {/if}

    <!-- Main Content -->
    <main class="flex-1 {selectedRepo ? 'ml-64' : ''} mt-16 p-6 overflow-y-auto">
    {#if selectedRepo}
        {#if commitDetailsView}
            <div class="mb-4">
                <button 
                    on:click={goBackToCommits} 
                        class="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700"
                >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Back to Commits
                </button>
            </div>
                <div class="bg-white border border-slate-200 rounded-xl p-6">
            <CommitChanges projectId={commitDetailsData.projectId} commitSha={commitDetailsData.commitSha} />
                </div>
        {:else}
                <div class="bg-white border border-slate-200 rounded-xl p-6">
                {#if view === "issues"} <Issues selectedRepo={selectedRepo} /> {/if}
                {#if view === "commits"} <Commits selectedRepo={selectedRepo} /> {/if}
                {#if view === "branches"} <Branches selectedRepo={selectedRepo} /> {/if}
                {#if view === "mergeRequests"} <MergeRequests selectedRepo={selectedRepo} /> {/if}
                {#if view === "tags"} <Tags selectedRepo={selectedRepo} /> {/if}
                {#if view === "branchCommits"} <BranchCommits selectedRepo={selectedRepo} /> {/if}
                {#if view === "createIssue"} <CreateIssues selectedRepo={selectedRepo} /> {/if}
                {#if view === "createTag"} <CreateTags selectedRepo={selectedRepo} /> {/if}
                {#if view === "createBranch"} <CreateBranch selectedRepo={selectedRepo} /> {/if}
                {#if view === "createCommit"} <CommitForm selectedRepo={selectedRepo} /> {/if}
                {#if view === "createMergeRequest"} <MergeRequestForm selectedRepo={selectedRepo} /> {/if}
            </div>
        {/if}
        {:else}
            <div class="flex items-center justify-center h-full">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-black mb-2">Welcome to Repository Manager</h2>
                    <p class="text-slate-700">Select a repository from the dropdown to get started</p>
                </div>
            </div>
    {/if}
</main>
</div>

<style>
        .nav-item {
            display: flex;
            align-items: center;
        width: 100%;
            padding: 0.75rem 1rem;
            color: #000000;
        border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }

        .nav-item:hover {
            background-color: rgba(148, 163, 184, 0.15);
            color: #000000;
            transform: translateX(4px);
        }

        select {
            background-color: #ffffff;
            color: #000000;
            transition: all 0.2s ease;
        }

        select option {
            background-color: #ffffff;
            color: #000000;
        }

        /* Add transition for all color changes */
        * {
            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 200ms;
    }
</style>