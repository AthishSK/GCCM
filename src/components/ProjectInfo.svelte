<script>
    export let repoDetails;
</script>

<div class="project-info">
    <h3>{repoDetails.name}</h3>
    <p><strong>Visibility:</strong> {repoDetails.visibility}</p>
    <p><strong>Last Activity:</strong> {new Date(repoDetails.last_activity_at).toLocaleString()}</p>
</div>

<style>
    .project-info {
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
        margin-top: 15px;
    }
</style>
