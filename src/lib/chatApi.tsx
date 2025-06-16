export async function getConversations(userId: number) {
  const res = await fetch(`https://datingwebbe-jnmo.onrender.com/api/chat/conversations/${userId}`);
  if (!res.ok) throw new Error('Không thể lấy danh sách hội thoại');
  return await res.json();
}

export async function getMessages(conversationId: number, page = 1, pageSize = 50) {
  const res = await fetch(`https://datingwebbe-jnmo.onrender.com/api/chat/messages/${conversationId}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Không thể lấy tin nhắn');
  return await res.json();
}
