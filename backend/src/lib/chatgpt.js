export const fetchChatGPT = async (prompt: string) => {
  const response = await fetch('http://localhost:1338/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la génération AI');
  }

  return await response.json();
};
