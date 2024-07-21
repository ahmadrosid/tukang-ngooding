<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
</script>

<div class="flex h-screen text-white font-sans">
  <Sidebar />
  <main class="flex-grow overflow-y-auto bg-neutral-900 relative">
    <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" style="background-position: 10px 10px;"></div>
    <slot></slot>
  </main>
</div>
