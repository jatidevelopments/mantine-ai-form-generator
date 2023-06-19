import { Configuration, OpenAIApi } from 'openai';
import { validateJSON } from './validateJSON';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

const removeNewLinesAndTabs = (str: string): string =>
  str.replace(/(\r\n|\n|\r|\t)/gm, ' ');

export const requestPrompt = async (
  prompt: string,
  agentExtent?: string,
): Promise<Array<string>> => {
  const start = Date.now();

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are Form JSON Generator. You only and always respond with valid JSON, nothing else than JSON. Your answers always start with { and end with }. ' +
          agentExtent,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.27,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  console.log(`Response time: ${Date.now() - start}ms`);

  if (response?.data) console.log(response?.data);

  return (
    response?.data?.choices?.map((choice) => choice?.message?.content || '') ||
    []
  );
};

export const requestPromptUntilValidWithRetry = async (
  prompt: string,
  retry: number,
  agentExtent?: string,
): Promise<any[]> => {
  try {
    const result = await requestPrompt(prompt, agentExtent);

    const array: any[] = result
      .map((item) => validateJSON(removeNewLinesAndTabs(item)))
      .flat();

    if (array.length === 0) throw new Error('Invalid response');

    console.log({ array });

    return array[0];
  } catch (error) {
    console.log({ error });

    if (retry >= 0)
      return await requestPromptUntilValidWithRetry(
        prompt,
        retry - 1,
        agentExtent,
      );
    else throw new Error('Invalid response');
  }
};
