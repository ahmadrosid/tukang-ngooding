import { writable } from 'svelte/store';

type LLMProvider = 'anthropic' | 'openai';

function createLLMProviderStore() {
    const { subscribe, set, update } = writable<LLMProvider>('anthropic');

    return {
        subscribe,
        set: (value: LLMProvider) => {
            set(value);
            localStorage.setItem('llmProvider', value);
        },
        initialize: () => {
            const storedProvider = localStorage.getItem('llmProvider') as LLMProvider | null;
            if (storedProvider) {
                set(storedProvider);
            }
        }
    };
}

export const llmProvider = createLLMProviderStore();