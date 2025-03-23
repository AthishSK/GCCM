// Default values for GitLab API
const GITLAB_API_URL = process.env.PUBLIC_GITLAB_API_URL || 'http://80.1.0.250:100/api/v4';
const GITLAB_ACCESS_TOKEN = process.env.PUBLIC_GITLAB_ACCESS_TOKEN || '';

/**
 * @typedef {Object} GitLabResponse
 * @property {number} status - HTTP status code
 * @property {string} message - Error message
 */

/**
 * @typedef {Object} CommitAction
 * @property {string} action - Action type (create, update, delete, move)
 * @property {string} file_path - File path
 * @property {string} content - File content
 * @property {string} [previous_path] - Previous file path (for move action)
 */

/**
 * Fetches data from GitLab API
 * @param {string} url - API endpoint URL
 * @param {string} method - HTTP method
 * @param {Object|null} body - Request body
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the request fails
 */
async function fetchFromGitLab(url, method = 'GET', body = null) {
    try {
        /** @type {RequestInit} */
        const options = {
            method,
            headers: {
                "Authorization": `Bearer ${GITLAB_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${GITLAB_API_URL}${url}`, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`GitLab API Error (${response.status}): ${errorData.message || 'Unknown error'}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error; // Re-throw to handle in components
    }
}

// Fetch repository-related data
export async function fetchGitLabRepos() {
    return fetchFromGitLab(`/projects?membership=true&simple=true&per_page=100`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoDetails(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoIssues(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/issues?per_page=100`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoCommits(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/commits?per_page=100`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoBranches(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/branches`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoMergeRequests(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened&per_page=100`);
}

/**
 * @param {string} projectId - GitLab project ID
 */
export async function fetchRepoTags(projectId) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/tags`);
}

// Create a new issue
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} title - Issue title
 * @param {string} description - Issue description
 */
export async function createIssue(projectId, title, description) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/issues`, 'POST', { title, description });
}

// Create a new branch
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} branchName - New branch name
 * @param {string} ref - Reference branch/tag
 */
export async function createBranch(projectId, branchName, ref) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/branches`, 'POST', {
        branch: branchName,
        ref: ref
    });
}

// Create a new tag
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} tagName - New tag name
 * @param {string} ref - Reference branch/tag
 */
export async function createTag(projectId, tagName, ref) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/tags`, 'POST', { 
        tag_name: tagName, 
        ref 
    });
}

// Create a new commit
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} branch - Target branch
 * @param {string} commitMessage - Commit message
 * @param {Array<CommitAction>} actions - Commit actions
 */
export async function createCommit(projectId, branch, commitMessage, actions) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/commits`, 'POST', {
        branch,
        commit_message: commitMessage,
        actions
    });
}

// Create a new merge request
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} sourceBranch - Source branch
 * @param {string} targetBranch - Target branch
 * @param {string} title - Merge request title
 */
export async function createMergeRequest(projectId, sourceBranch, targetBranch, title) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/merge_requests`, 'POST', {
        source_branch: sourceBranch,
        target_branch: targetBranch,
        title
    });
}

// Get commits for a specific branch
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} branchName - Branch name
 */
export async function fetchBranchCommits(projectId, branchName) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/commits?ref_name=${encodeURIComponent(branchName)}&per_page=100`);
}

// Get changes for a specific commit
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} commitSha - Commit SHA
 */
export async function fetchCommitChanges(projectId, commitSha) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/commits/${encodeURIComponent(commitSha)}/diff`);
}

// Cherry-pick a commit to a target branch
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} commitSha - Commit SHA
 * @param {string} targetBranch - Target branch
 */
export async function cherryPickCommit(projectId, commitSha, targetBranch) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/commits/${encodeURIComponent(commitSha)}/cherry_pick`, 'POST', {
        branch: targetBranch
    });
}

// Fetch the latest merge request for a specific branch
/**
 * @param {string} projectId - GitLab project ID
 * @param {string} targetBranch - Target branch
 */
export async function fetchLatestMergeRequest(projectId, targetBranch) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened&target_branch=${encodeURIComponent(targetBranch)}`);
}