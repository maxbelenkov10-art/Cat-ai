export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Auth");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const auth = req.headers["x-auth"];
  if (auth !== "cat-ai-secret-2025") {
    return res.status(401).json({ error: { message: "unauthorized" } });
  }

  try {
    const body = req.body;
    const model = body.model || "gemini-2.0-flash";

    const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                model +
                ":generateContent?key=AQ.Ab8RN6L_2qUNtBawVBab0yVVzlWPkGLtMguKa8Mzv8MniIw1vw";

    const payload = {
      contents: body.contents,
      generationConfig: { temperature: body.temperature ?? 0.7 },
    };
    if (body.system) {
      payload.systemInstruction = { parts: [{ text: body.system }] };
    }

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.text();
    res.status(r.status).setHeader("Content-Type", "application/json").send(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
      }
