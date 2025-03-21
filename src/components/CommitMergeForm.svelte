<script>
    /* 
    import { createCommit, createMergeRequest } from '../lib/api.js';
    let projectId = ''; // Set the GitLab project ID dynamically
    let branch = 'main';
    let commitMessage = '';
    let filePath = '';
    let fileContent = '';
    let sourceBranch = '';
    let targetBranch = '';
    let mergeTitle = '';
  
    async function handleCommit() {
      const actions = [{
        action: 'create', // Can be 'create', 'update', or 'delete'
        file_path: filePath,
        content: fileContent
      }];
      
      try {
        const response = await createCommit(projectId, branch, commitMessage, actions);
        alert('Commit created successfully!');
        console.log(response);
      } catch (error) {
        console.error('Error creating commit:', error);
      }
    }
  
    async function handleMergeRequest() {
      try {
        const response = await createMergeRequest(projectId, sourceBranch, targetBranch, mergeTitle);
        alert('Merge Request created successfully!');
        console.log(response);
      } catch (error) {
        console.error('Error creating merge request:', error);
      }
    } */
  </script>
  <!-- 
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Create Commit</h3>
    <div class="space-y-3">
      <input type="text" bind:value={filePath} placeholder="File Path" class="w-full p-2 border rounded" />
      <textarea bind:value={fileContent} placeholder="File Content" class="w-full p-2 border rounded h-32"></textarea>
      <input type="text" bind:value={commitMessage} placeholder="Commit Message" class="w-full p-2 border rounded" />
      <button on:click={handleCommit} class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Commit</button>
    </div>
  </div>
  
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
    <h3 class="text-lg font-semibold mb-4">Create Merge Request</h3>
    <div class="space-y-3">
      <input type="text" bind:value={sourceBranch} placeholder="Source Branch" class="w-full p-2 border rounded" />
      <input type="text" bind:value={targetBranch} placeholder="Target Branch" class="w-full p-2 border rounded" />
      <input type="text" bind:value={mergeTitle} placeholder="Merge Request Title" class="w-full p-2 border rounded" />
      <button on:click={handleMergeRequest} class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Create Merge Request</button>
    </div>
  </div> -->