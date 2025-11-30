/**
 * AI Configuration for OpenRouter
 */

export const AI_CONFIG = {
  OPENROUTER_API_KEY: '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',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  MODEL: 'x-ai/grok-4.1-fast:free',
};

/**
 * Make a request to OpenRouter AI
 */
export async function askAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const response = await fetch(`${AI_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Papermorph',
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('AI request error:', error);
    throw error;
  }
}

/**
 * Generate document content using AI
 */
export async function generateDocument(payload: {
  type: string;
  data: Record<string, string>;
}): Promise<string> {
  const systemPrompt = `You are a professional document writer. Generate a well-formatted ${payload.type} document based on the provided information. Use proper formatting with headings, paragraphs, and lists where appropriate. Output in HTML format suitable for a rich text editor.`;
  
  const userPrompt = `Generate a ${payload.type} with the following details:\n${Object.entries(payload.data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}`;

  return askAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

/**
 * Rewrite text with AI
 */
export async function rewriteText(payload: {
  text: string;
  tone?: 'formal' | 'casual' | 'professional';
  action?: 'condense' | 'expand' | 'summarize' | 'fix-grammar';
}): Promise<string> {
  let instruction = '';
  
  if (payload.tone) {
    instruction = `Rewrite the following text in a ${payload.tone} tone:`;
  } else if (payload.action) {
    switch (payload.action) {
      case 'condense':
        instruction = 'Make the following text more concise while keeping the main points:';
        break;
      case 'expand':
        instruction = 'Expand the following text with more details and explanations:';
        break;
      case 'summarize':
        instruction = 'Provide a brief summary of the following text:';
        break;
      case 'fix-grammar':
        instruction = 'Fix any grammar and spelling errors in the following text:';
        break;
    }
  }

  return askAI([
    { role: 'system', content: 'You are a helpful writing assistant. Only return the rewritten text without any explanations.' },
    { role: 'user', content: `${instruction}\n\n${payload.text}` },
  ]);
}

/**
 * Generate a new section based on context
 */
export async function generateSection(context: string, instruction: string): Promise<string> {
  return askAI([
    { role: 'system', content: 'You are a professional document writer. Generate content in HTML format suitable for a rich text editor. Do not include any markdown formatting.' },
    { role: 'user', content: `Based on this context:\n${context}\n\nGenerate: ${instruction}` },
  ]);
}
