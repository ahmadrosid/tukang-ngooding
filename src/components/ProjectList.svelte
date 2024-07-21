<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let projects: string[] = [];
  export let currentProject: string;

  let newProjectName: string = "";
  let isAddingProject: boolean = false;

  const dispatch = createEventDispatcher();

  function switchProject(project: string): void {
    dispatch("switchProject", project);
  }

  function startAddingProject(): void {
    isAddingProject = true;
    newProjectName = "";
  }

  function addProject(): void {
    if (newProjectName.trim()) {
      dispatch("addProject", newProjectName.trim());
      isAddingProject = false;
    }
  }

  function cancelAddProject(): void {
    isAddingProject = false;
    newProjectName = "";
  }
</script>

<div>
  {#if isAddingProject}
    <h2 class="font-bold mb-2">Add Project</h2>
    <div class="mt-2">
      <input
        type="text"
        bind:value={newProjectName}
        placeholder="New project name"
        class="w-full p-2 bg-neutral-700 rounded text-white"
      />
      <div class="grid grid-cols-2 gap-2 mt-2">
        <button
          on:click={addProject}
          class="px-2 py-1 bg-orange-700 rounded hover:bg-orange-800"
        >
          Add
        </button>
        <button
          on:click={cancelAddProject}
          class="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <h2 class="font-bold mb-2">Projects</h2>
    <ul class="space-y-1">
      {#each projects as project}
        <li>
          <button
            class={`w-full text-sm text-left p-2 rounded border border-neutral-700 truncate ${
              currentProject === project
                ? "bg-neutral-700"
                : "hover:bg-neutral-700"
            }`}
            on:click={() => switchProject(project)}
          >
            {project}
          </button>
        </li>
      {/each}
    </ul>
    <button
      on:click={startAddingProject}
      class="w-full mt-2 p-2 bg-orange-700 rounded hover:bg-orange-800 text-sm"
    >
      Add Project
    </button>
  {/if}
</div>
