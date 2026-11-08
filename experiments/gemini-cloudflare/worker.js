// COOKIEXMAX sandbox. Secrets live only in Cloudflare, never in GitHub.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return Response.json({
        service: 'cookiexmax-gemini-sandbox',
        ready: true,
        keyConfigured: Boolean(env.GEMINI_API_KEY),
        source: 'github/cookiexmax/agents',
        pipelineTest: 'github-to-cloudflare-manual-v1'
      }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (url.pathname !== '/verify-7c91e8b4a52d4f0e9b13c6a27d50f841') {
      return new Response('Not found', { status: 404 });
    }
    if (!env.GEMINI_API_KEY) return Response.json({ ok: false, error: 'Missing secret' }, { status: 500 });
    const models = ['gemini-3.8-flash', 'gemini-3-flash-preview'];
    const attempts = [];
    for (const model of models) {
      for (let i = 0; i < 2; i++) {
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Reply exactly: COOKIEXMAX GEMINI CONNECTED' }] }],
              generationConfig: { maxOutputTokens: 160, temperature: 0 }
            })
          });
          const json = await response.json();
          const reply = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || null;
          attempts.push({ model, status: response.status, error: json.error?.message?.slice(0, 140) || null });
          if (response.ok) return Response.json({ ok: true, httpStatus: response.status, model, reply, attempts }, { headers: { 'Cache-Control': 'no-store' } });
          if (![429, 500, 502, 503, 504].includes(response.status)) break;
        } catch (error) {
          attempts.push({ model, error: String(error).slice(0, 140) });
        }
        if (i === 0) await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return Response.json({ ok: false, attempts }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
