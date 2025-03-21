const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const GITLAB_ACCESS_TOKEN = 'API-KEY'; // Store securely

async function fetchFromGitLab(url, method = 'GET', body = null) {
    try {
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
            const errorMsg = await response.text();
            throw new Error(`GitLab API Error (${response.status}): ${errorMsg}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return url.includes('/projects/') ? null : []; // Return `null` for single objects
    }
}

// Fetch repository-related data
export async function fetchGitLabRepos() {
    return fetchFromGitLab(`/projects?membership=true&simple=true&per_page=100`);
}

export async function fetchRepoDetails(project_id) {
    return fetchFromGitLab(`/projects/${project_id}`);
}

export async function fetchRepoIssues(project_id) {
    return fetchFromGitLab(`/projects/${project_id}/issues?per_page=100`);
}

export async function fetchRepoCommits(project_id) {
    return fetchFromGitLab(`/projects/${project_id}/repository/commits?per_page=100`);
}

export async function fetchRepoBranches(project_id) {
    return fetchFromGitLab(`/projects/${project_id}/repository/branches`);
}

export async function fetchRepoMergeRequests(project_id) {
    return fetchFromGitLab(`/projects/${project_id}/merge_requests?state=opened&per_page=100`);
}

export async function fetchRepoTags(project_id) {
    return fetchFromGitLab(`/projects/${project_id}/repository/tags`);
}

// Create a new issue
export async function CreateIssues(project_id, title, description) {
    return fetchFromGitLab(`/projects/${project_id}/issues`, 'POST', { title, description });
}

// Create a new branch (Fixed)
export async function createBranch(projectId, branchName, ref) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/repository/branches`, 'POST', {
        branch: branchName,
        ref: ref
    });
}

// Create a new tag
export async function createTag(project_id, tag_name, ref) {
    return fetchFromGitLab(`/projects/${project_id}/repository/tags`, 'POST', { tag_name, ref });
}

// Create a new commit
export async function createCommit(project_id, branch, commit_message, actions) {
    return fetchFromGitLab(`/projects/${project_id}/repository/commits`, 'POST', {
        branch,
        commit_message,
        actions
    });
}

// Create a new merge request
export async function createMergeRequest(project_id, source_branch, target_branch, title) {
    return fetchFromGitLab(`/projects/${project_id}/merge_requests`, 'POST', {
        source_branch,
        target_branch,
        title
    });
}

// Get commits for a specific branch
export async function fetchBranchCommits(project_id, branch_name) {
    return fetchFromGitLab(`/projects/${project_id}/repository/commits?ref_name=${encodeURIComponent(branch_name)}&per_page=100`);
}

// Get changes for a specific commit
export async function fetchCommitChanges(project_id, commit_sha) {
    return fetchFromGitLab(`/projects/${project_id}/repository/commits/${commit_sha}/diff`);
}

// Cherry-pick a commit to a target branch
export async function cherryPickCommit(project_id, commit_sha, target_branch) {
    return fetchFromGitLab(`/projects/${project_id}/repository/commits/${commit_sha}/cherry_pick`, 'POST', {
        branch: target_branch
    });
}

// Fetch the latest merge request for a specific branch
export async function fetchLatestMergeRequest(projectId, targetBranch) {
    return fetchFromGitLab(`/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened&target_branch=${encodeURIComponent(targetBranch)}`);
}