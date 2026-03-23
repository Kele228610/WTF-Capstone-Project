import { apiFetch } from './client';

function extractAnswer(data) {
  return (
    data?.answer ||
    data?.response ||
    data?.message ||
    data?.data?.answer ||
    data?.data?.response ||
    data?.data?.message ||
    ''
  );
}

export async function sendAiChat(question) {
  const data = await apiFetch('/api/v1/ai/chat', {
    method: 'POST',
    body: { question },
  });

  return {
    raw: data,
    answer: extractAnswer(data),
  };
}
