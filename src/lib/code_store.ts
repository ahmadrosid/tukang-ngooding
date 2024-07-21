import { writable } from 'svelte/store';

export type CodeStoreType = {
    code: string,
    language: string,
    path: string,
    fileName: string,
    lastModified: string,
    size: 0,
    isDirty: false
}

export const codeStore = writable<CodeStoreType>({
    code: '// Your code will be here',
    language: 'typescript',
    path: 'main.ts',
    fileName: 'main.ts',
    lastModified: new Date().toISOString(),
    size: 0,
    isDirty: false
});

export function updateCode(newCode: CodeStoreType) {
    codeStore.set(newCode);
}
