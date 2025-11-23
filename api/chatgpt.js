export const config = {
  runtime: 'edge',
};

const jsonHeaders = { 'Content-Type': 'application/json' };

const buildPrompt = ({ companyName, productRef, currentDescription }) => `You are an exhibition stand strategist.
Company: ${companyName || 'Unknown brand'}
Product reference: ${productRef || 'N/A'}
Current description: ${currentDescription || 'Not provided'}

Return concise JSON with keys description (1-2 sentences), pros (3 short bullet points), and cons (3 short bullet points).`;

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: jsonHeaders });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500, headers: jsonHeaders });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: jsonHeaders });
  }

  const prompt = buildPrompt(payload || {});

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You generate trade show stand content as structured JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: 'OpenAI request failed', detail: errorText }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return new Response(
      JSON.stringify({
        description: parsed.description,
        pros: parsed.pros,
        cons: parsed.cons,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI generation failed', detail: String(error) }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
}
