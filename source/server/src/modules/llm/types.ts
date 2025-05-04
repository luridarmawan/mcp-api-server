
export interface Message {
    role: 'system' | 'user' | 'assistant' | string;
    content: string;
}

export interface ChatCompletionRequest {
    vendor?: 'openai' | 'localllm'; // bisa diperluas nanti
    model: string;
    messages: Message[];
}

