export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const forcedModel = process.env.ANTHROPIC_MODEL;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY env var" });
  }

  try {
    const basePayload = typeof req.body === "object" && req.body ? req.body : {};

    const candidateModels = [
      forcedModel,
      basePayload.model,
      "claude-3-5-haiku-latest",
      "claude-3-haiku-20240307",
      "claude-3-7-sonnet-latest",
      "claude-3-5-sonnet-latest"
    ].filter(Boolean);

    let lastStatus = 500;
    let lastData = { error: "No model candidates available" };

    for (const model of candidateModels) {
      const payload = { ...basePayload, model };
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(payload)
      });

      const data = await upstream.json();
      if (upstream.ok) {
        return res.status(upstream.status).json(data);
      }

      lastStatus = upstream.status;
      lastData = data;

      const errText = String(data?.error?.message || data?.error || "").toLowerCase();
      const isModelError = errText.includes("model");
      if (!isModelError) {
        return res.status(upstream.status).json(data);
      }
    }

    return res.status(lastStatus).json(lastData);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy request failed",
      detail: String(error && error.message ? error.message : error)
    });
  }
}
