import type { Resume } from "./types";
import { format, parseISO, addDays } from "date-fns";

const PERMANENT_DELETE_DAYS = 7;

export function formatResumeDate(dateString: string | null): string {
  // Thêm kiểm tra null
  if (!dateString) return "Unknown Date"; 
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    return "Invalid Date";
  }
}

export function formatDeletedTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, "h:mm a, do MMMM yyyy");
  } catch (error) {
    return "Invalid Date";
  }
}

export function canRestore(resume: Resume): boolean {
  if (resume.deletedAt === null) return false;
  try {
    const deletedDate = parseISO(resume.deletedAt);
    const permanentDeleteDate = addDays(deletedDate, PERMANENT_DELETE_DAYS);
    return new Date() < permanentDeleteDate;
  } catch (error) {
    return false;
  }
}

export function daysUntilPermanentDelete(resume: Resume): number {
  if (resume.deletedAt === null) return 0;
  try {
    const deletedDate = parseISO(resume.deletedAt);
    const permanentDeleteDate = addDays(deletedDate, PERMANENT_DELETE_DAYS);
    const now = new Date();
    const msLeft = permanentDeleteDate.getTime() - now.getTime();
    return Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
}

// --- CÁC HÀM THAO TÁC DỮ LIỆU - VIẾT LẠI HOÀN TOÀN ĐỂ GỌI API ---

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Lấy danh sách tất cả CV từ backend.
 * Cần accessToken để xác thực người dùng.
 * @param accessToken - JWT token từ session
 * @returns Promise<Resume[]>
 */
export async function getResumes(accessToken: string): Promise<Resume[]> {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch resumes');
  }

  return response.json();
}


/**
 * Cập nhật một CV trên server.
 * @param id - ID của CV cần cập nhật
 * @param data - Dữ liệu cập nhật
 * @param accessToken - JWT token
 * @returns Promise<Resume>
 */
export async function updateResume(id: string, data: Partial<Resume>, accessToken: string): Promise<Resume> {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    method: 'PUT', // Hoặc 'PATCH'
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update resume');
  }

  return response.json();
}

/**
 * Xóa mềm một CV.
 * @param id - ID của CV cần xóa
 * @param accessToken - JWT token
 * @returns Promise<void>
 */
export async function deleteResume(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete resume');
  }
  // DELETE request thường không trả về body, chỉ cần kiểm tra status
}


/**
 * Khôi phục một CV đã xóa mềm.
 * @param id - ID của CV cần khôi phục
 * @param accessToken - JWT token
 * @returns Promise<Resume>
 */
export async function restoreResume(id: string, accessToken: string): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/restore`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to restore resume');
    }
    
    return response.json();
}


/**
 * Toggle trạng thái yêu thích của một CV.
 * @param id - ID của CV
 * @param accessToken - JWT token
 * @returns Promise<Resume>
 */
export async function toggleFavoriteApi(id: string, accessToken: string): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/toggle-favorite`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to toggle favorite status');
    }

    return response.json();
}