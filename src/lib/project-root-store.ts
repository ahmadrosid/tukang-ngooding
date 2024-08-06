import { writable } from 'svelte/store';

export const projectRoot = writable<string>('./'); 
