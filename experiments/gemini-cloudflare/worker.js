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
        pipelineTest: 'github-push-auto-build-v3',
        orchestration: 'ai-council-prototype-v1'
      }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (url.pathname === '/workflow') {
      return Response.json({
        project: 'COOKIEXMAX',
        version: 'fixed-task-demo-v1',
        pipeline: ['ChatGPT: task specification', 'GitHub: source and version control', 'Cloudflare: automatic deployment and execution', 'Gemini: bounded creative analysis', 'ChatGPT: review and acceptance'],
        test: '/demo/brief',
        mode: 'sandbox',
        note: 'Demonstration is not an autonomous agent or production task queue.'
      }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const isCouncil = url.pathname === '/council/demo';
    const isDemo = url.pathname === '/demo/brief' || isCouncil;
    if (!isDemo && url.pathname !== '/verify-7c91e8b4a52d4f0e9b13c6a27d50f841') {
      return new Response('Not found', { status: 404 });
    }
    if (isDemo && request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    const councilPrompt = 'You are Gemini acting as a creative and architecture co-designer, not a subordinate executor. Topic: COOKIEXMAX x NINA digital music civilization portal with modular interactive visual DNA. In concise Chinese, produce valid JSON with keys: creative_vision, architecture_proposal, challenges_to_engineering_plan (array of 3), alternatives (array of 2), implementation_priorities (array of 3), decision_questions (array of 2). Critique the following ChatGPT-authored engineering hypothesis: start with isolated Cloudflare Worker endpoints, version in GitHub, store structured design decisions later. Explain tradeoffs. Do not pretend to have spoken with ChatGPT in real time. Do not claim deployment or approval. This is a single Gemini contribution to a future multi-agent council.';
    const demoPrompt = 'For the fictional COOKIEXMAX music world, propose one 3-shot cyberpunk visual sequence inspired by ancient Shu geometric motifs and Chinese philosophy. Respond in concise Chinese JSON with keys theme, shots (array of 3 short strings), and qa_checklist (array of 3 short strings). Do not claim any real-world deployment or completed asset.';
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
              contents: [{ parts: [{ text: isCouncil ? councilPrompt : (isDemo ? demoPrompt : 'Reply exactly: COOKIEXMAX GEMINI CONNECTED') }] }],
              generationConfig: { maxOutputTokens: isCouncil ? 4096 : (isDemo ? 1200 : 160), temperature: 0, ...(isDemo ? { responseMimeType: 'application/json' } : {}) }
            })
          });
          const json = await response.json();
          const reply = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || null;
          const finishReason = json.candidates?.[0]?.finishReason || null;
          let parsed = null;
          if (isDemo && reply) {
            try { parsed = JSON.parse(reply.replace(/^\`\`\`(?:json)?\\s*|\\s*\`\`\`$/g, '').trim()); } catch (_) {}
          }
          const complete = Boolean(reply) && (!isDemo || (parsed !== null && finishReason === 'STOP'));
          attempts.push({ model, status: response.status, finishReason, complete, error: json.error?.message?.slice(0, 140) || null });
          if (response.ok && complete) return Response.json({ ok: true, task: isCouncil ? 'gemini-council-proposal' : (isDemo ? 'creative-brief-demo' : 'connection-verification'), httpStatus: response.status, model, reply: isDemo ? undefined : reply, result: isDemo ? parsed : undefined, finishReason, attempts }, { headers: { 'Cache-Control': 'no-store' } });
          if (response.ok && !complete) continue;
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
