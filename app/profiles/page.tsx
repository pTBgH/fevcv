"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithToken } from '@/lib/apiClient'; // <-- Import hàm mới

// Định nghĩa kiểu dữ liệu cho User mà Laravel sẽ trả về
interface LaravelUser {
  message: string;
  data: {
    id: string;
    username: string;
    name: string;
    email: string;
    email_verified: boolean;
  }
}

const ProfilePage = () => {
  // Lấy session và status từ NextAuth
  const { data: session, status } = useSession({ required: true });

  // Các state để quản lý dữ liệu, lỗi và trạng thái loading
  const [user, setUser] = useState<LaravelUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Chỉ thực hiện khi đã đăng nhập và có session.accessToken
    if (status === 'authenticated' && session?.accessToken) {
      
      const loadProfileData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // GỌI HÀM MỚI: Truyền endpoint và accessToken từ session vào
          const data = await fetchWithToken<LaravelUser>(
            '/profiles', 
            session.accessToken!
          );
          setUser(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
            console.error("Lỗi khi tải profile:", err);
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadProfileData();
    }
  }, [status, session]); // Chạy lại effect khi status hoặc session thay đổi

  // Xử lý giao diện khi đang tải
  if (status === 'loading' || isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Xử lý giao diện khi có lỗi
  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  // Giao diện chính
  return (
    <div>
      <h1>Xin chào, {session?.user?.name}!</h1>
      <h2 style={{ marginTop: '2rem' }}>Đây là dữ liệu được trả về từ Laravel Backend:</h2>
      {user ? (
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '5px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default ProfilePage;