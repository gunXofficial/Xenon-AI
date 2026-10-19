// api/chat.js
export const config = {
  runtime: 'edge', // Menggunakan Edge Runtime Vercel (Streaming super cepat)
};

export default async function handler(req) {
  // 1. Ambil API Key dari Environment Variables Vercel
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "API Key belum diatur di Vercel." } }), { status: 500 });
  }

  // 2. Ambil payload (messages) dari Frontend
  const body = await req.json();

  // 3. Teruskan request ke Groq API (menggunakan API Key rahasia)
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  // 4. Kembalikan respons (termasuk streaming) ke Frontend
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
