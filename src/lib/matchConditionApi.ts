const MATCH_CONDITION_API_URL = "http://localhost:5291/api/MatchCondition";

// Lấy tiêu chí ghép đôi theo accountId
export async function getMatchCondition(accountId: number) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}/${accountId}`);
  if (!res.ok) return null;
  return await res.json();
}

// Tạo mới tiêu chí ghép đôi
export async function createMatchCondition(data: {
  AccountId: number;
  MinAge: number;
  MaxAge: number;
  MaxDistanceKm: number;
  GenderId: number;
}) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tạo tiêu chí thất bại');
  return await res.json();
}

// Cập nhật tiêu chí ghép đôi theo accountId
export async function updateMatchCondition(accountId: number, data: {
  AccountId: number;
  MinAge: number;
  MaxAge: number;
  MaxDistanceKm: number;
  GenderId: number;
}) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}/update/account/${accountId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Cập nhật tiêu chí thất bại');
  return true;
}
