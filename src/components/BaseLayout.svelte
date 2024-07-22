<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <slot></slot>
  </main>
</div>
