import { writable } from 'svelte/store';

export const filePaths = writable<string[]>([]);
