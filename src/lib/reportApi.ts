const REPORT_API_URL = "http://localhost:5291/api/Report";

export interface ReportType {
  id: number;
  reportTypeName: string;
}

export async function getReportTypes(): Promise<ReportType[]> {
  const res = await fetch(REPORT_API_URL);
  
  if (!res.ok) {
    throw new Error('Không thể lấy danh sách loại báo cáo');
  }
  
  return await res.json();
}

export async function createReport(
  userId: number,
  reportedUserId: number,
  reportedTypeId: number,
  content: string
) {
  const res = await fetch(
    `${REPORT_API_URL}/report?userId=${userId}&reportedUserId=${reportedUserId}&reportedTypeId=${reportedTypeId}&content=${encodeURIComponent(content)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!res.ok) {
    throw new Error('Không thể gửi báo cáo');
  }
  
  return await res.json();
} 