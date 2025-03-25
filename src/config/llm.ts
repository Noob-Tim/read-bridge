import { Provider } from "@/src/types/llm";

export const defaultProviders = (): Provider[] => {
  return [
    {
      id: 'openai',
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      isDefault: true,
      models: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          providerId: 'openai',
          temperature: 0.5,
          topP: 1,
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          providerId: 'openai',
          temperature: 0.5,
          topP: 1,
        },
        {
          id: 'o1-preview',
          name: 'o1-preview',
          providerId: 'openai',
          temperature: 0.6,
          topP: 1,
        },
        {
          id: 'o1-mini',
          name: 'o1-mini',
          providerId: 'openai',
          temperature: 0.6,
          topP: 1,
        }
      ],
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com',
      apiKey: '',
      isDefault: true,
      models: [
        {
          id: 'deepseek-chat',
          name: 'DeepSeek Chat',
          providerId: 'deepseek',
          temperature: 0.5,
          topP: 1,
        },
        {
          id: 'deepseek-reasoner',
          name: 'DeepSeek Reasoner',
          providerId: 'deepseek',
          temperature: 0.6,
          topP: 1,
        }
      ]
    }
  ]
}
