import { openai, SYSTEM_PROMPT, MODEL, MAX_TOKENS, TEMPERATURE } from '../config/openai';

/**
 * Generate an improved prompt using OpenAI API
 */
export async function generatePrompt(userInput: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userInput },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const generatedPrompt = completion.choices[0]?.message?.content;

    if (!generatedPrompt) {
      throw new Error('No response from OpenAI');
    }

    return generatedPrompt.trim();
  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error);

    if (error.code === 'insufficient_quota') {
      throw new Error('Превышен лимит API. Пожалуйста, попробуйте позже.');
    }

    if (error.code === 'rate_limit_exceeded') {
      throw new Error('Слишком много запросов. Подождите немного.');
    }

    throw new Error('Не удалось сгенерировать промпт. Попробуйте позже.');
  }
}

/**
 * Generate a chat title based on the first user message
 */
export function generateChatTitle(firstMessage: string): string {
  // Take first 50 characters or first sentence
  let title = firstMessage.split('.')[0] || firstMessage;
  title = title.substring(0, 50);

  if (firstMessage.length > 50) {
    title += '...';
  }

  return title.trim();
}
