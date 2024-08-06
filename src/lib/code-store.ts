import { writable } from 'svelte/store';

export type CodeStoreType = {
    code: string,
    language: string,
    path: string,
    fileName: string,
    lastModified: string,
    size: number,
    isDirty: false
}

const tutorialCode = `// Your code will be displayed here
// Use keyboard shortcut Cmd+P or Ctrl+P to open any file
// Use keyboard shortcut Cmd+S or Ctrl+S to save the file
// Start chatting with your code to get started
`;

const initialValue: CodeStoreType = {
    code: tutorialCode,
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

export function resetCode() {
    codeStore.set(initialValue);
}