export const AI_API_URL = "http://localhost:3000/api/chat";

export const aiService = {
  async ask(documentId: string, question: string) {
    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, question }),
      cache: "no-store",
    });

    if (!res.ok) {
      let message = "Lỗi khi hỏi AI";
      try {
        const body = await res.json();
        if (body?.message) message = body.message;
      } catch {}
      throw new Error(message);
    }

    return res.json();
  },
};
