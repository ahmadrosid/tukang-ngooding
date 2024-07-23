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

const initialValue: CodeStoreType = {
    code: '// Your code will be here',
    language: 'typescript',
    path: '',
    fileName: '',
    lastModified: new Date().toISOString(),
    size: 0,
    isDirty: false
};

export const codeStore = writable<CodeStoreType>(initialValue);

export function updateCode(newCode: CodeStoreType) {
    codeStore.set(newCode);
}
