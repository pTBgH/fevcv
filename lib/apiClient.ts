// Định nghĩa các tùy chọn cho hàm fetch
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Hàm gọi API chung, yêu cầu truyền vào token một cách tường minh.
 *
 * @param endpoint Đường dẫn API (ví dụ: '/profiles')
 * @param token Access Token của người dùng
 * @param options Các tùy chọn của fetch (method, body,...)
 * @returns Promise chứa dữ liệu trả về từ API
 */
export async function fetchWithToken<T>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  // Kiểm tra xem token có được cung cấp không
  if (!token) {
    throw new Error("Access Token là bắt buộc để thực hiện yêu cầu này.");
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  // Xây dựng headers mặc định
  const defaultHeaders: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Gọi API bằng fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    // Ghi đè các options mặc định bằng options người dùng truyền vào
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Xử lý lỗi
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Lỗi HTTP: ${response.status} ${response.statusText}`,
    }));
    throw new Error(errorData.message);
  }

  // Xử lý trường hợp không có nội dung trả về (204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  // Trả về dữ liệu dạng JSON
  return response.json() as Promise<T>;
}