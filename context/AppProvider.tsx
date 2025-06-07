"use client";

import type React from "react";

import Loader from "@/components/Loader";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface AppProviderType {
  authToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => void;
  isServerConnected: boolean;
}

export const AppContext = createContext<AppProviderType | undefined>(undefined);

// Cấu hình API URL - đảm bảo đúng URL của Laravel backend
// Thay đổi URL này nếu Laravel server của bạn chạy ở cổng khác
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
// process.env.NEXT_PUBLIC_API_URL ||
// Cấu hình axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Tắt withCredentials để tránh vấn đề CORS
  withCredentials: false,
  // Thêm timeout để tránh chờ quá lâu
  timeout: 10000,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);
  const router = useRouter();

  // Kiểm tra kết nối đến server
  const checkServerConnection = async () => {
    try {
      // Thử ping server để kiểm tra kết nối
      await axiosInstance.get("/ping", { timeout: 5000 });
      setIsServerConnected(true);
      return true;
    } catch (error) {
      console.warn("Cannot connect to server:", error);
      setIsServerConnected(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Kiểm tra kết nối server
      await checkServerConnection();

      // Khôi phục token nếu có
      const token = Cookies.get("authToken");
      if (token) {
        setAuthToken(token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Hàm mock đăng nhập cho môi trường development
  const mockLogin = (email: string, password: string) => {
    console.log("Using mock login with:", { email, password });

    // Giả lập token
    const mockToken = "mock_token_" + Math.random().toString(36).substring(2);

    // Lưu token
    Cookies.set("authToken", mockToken, { expires: 7 });
    setAuthToken(mockToken);

    // Thông báo
    Swal.fire({
      title: "Đăng nhập thành công (Chế độ giả lập)!",
      text: "Server không khả dụng, đang sử dụng chế độ giả lập",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    // Chuyển hướng
    setTimeout(() => {
      // Check if there's a redirect parameter in the URL
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get("redirect");

        // If there's a redirect path, navigate there instead of dashboard
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    }, 2000);

    return Promise.resolve();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Kiểm tra kết nối server trước
      const isConnected = await checkServerConnection();

      // Nếu không kết nối được và đang ở môi trường development, sử dụng mock login
      if (!isConnected && process.env.NODE_ENV === "development") {
        await mockLogin(email, password);
        setIsLoading(false);
        return;
      }

      // Hiển thị thông báo đang xử lý
      toast.loading("Đang đăng nhập...");

      // Gọi API đăng nhập
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      // Đóng toast loading
      toast.dismiss();

      console.log("Login response:", response.data);

      // Kiểm tra phản hồi từ Laravel
      if (response.data && response.data.token) {
        // Lấy token từ phản hồi
        const token = response.data.token;

        // Lưu token
        Cookies.set("authToken", token, { expires: 7 });
        setAuthToken(token);

        // Thêm token vào header mặc định của axios
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Chuyển hướng đến dashboard
        setTimeout(() => {
          // Check if there's a redirect parameter in the URL
          if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            const redirectPath = searchParams.get("redirect");

            // If there's a redirect path, navigate there instead of dashboard
            if (redirectPath) {
              router.push(redirectPath);
            } else {
              router.push("/dashboard");
            }
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        // Xử lý trường hợp không có token trong phản hồi
        Swal.fire({
          title: "Đăng nhập thất bại",
          text: response.data.message || "Thông tin đăng nhập không chính xác",
          icon: "error",
        });
      }
    } catch (error: any) {
      // Đóng toast loading
      toast.dismiss();

      console.error("Login error:", error);

      // Kiểm tra nếu là lỗi network
      if (error.message === "Network Error") {
        Swal.fire({
          title: "Không thể kết nối đến server",
          html: `
            <p>Không thể kết nối đến API server tại: <code>${API_URL}</code></p>
            <p>Vui lòng kiểm tra:</p>
            <ul class="text-left">
              <li>Laravel server đã chạy chưa</li>
              <li>URL API đã đúng chưa</li>
              <li>CORS đã được cấu hình đúng chưa</li>
            </ul>
          `,
          icon: "error",
        });

        // Nếu đang ở môi trường development, hỏi người dùng có muốn sử dụng mock login không
        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            Swal.fire({
              title: "Sử dụng chế độ giả lập?",
              text: "Bạn có muốn đăng nhập ở chế độ giả lập không?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Có",
              cancelButtonText: "Không",
            }).then((result) => {
              if (result.isConfirmed) {
                mockLogin(email, password);
              }
            });
          }, 1500);
        }
      } else if (error.response) {
        const errorMessage =
          error.response.data.message || "Đăng nhập thất bại";

        Swal.fire({
          title: "Lỗi đăng nhập",
          text: errorMessage,
          icon: "error",
        });

        // Log chi tiết lỗi để debug
        console.error("Error details:", error.response.data);
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        Swal.fire({
          title: "Không nhận được phản hồi từ server",
          text: "Server không phản hồi. Vui lòng thử lại sau.",
          icon: "error",
        });
      } else {
        // Lỗi kết nối
        Swal.fire({
          title: "Lỗi kết nối",
          text: error.message || "Có lỗi xảy ra khi kết nối đến server",
          icon: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    setIsLoading(true);
    try {
      // Kiểm tra kết nối server trước
      const isConnected = await checkServerConnection();

      // Nếu không kết nối được và đang ở môi trường development, sử dụng mock register
      if (!isConnected && process.env.NODE_ENV === "development") {
        // Giả lập đăng ký thành công
        Swal.fire({
          title: "Đăng ký thành công (Chế độ giả lập)!",
          text: "Server không khả dụng, đang sử dụng chế độ giả lập",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Chuyển hướng
        setTimeout(() => {
          router.push("/auth");
        }, 2000);

        setIsLoading(false);
        return;
      }

      // Hiển thị thông báo đang xử lý
      toast.loading("Đang đăng ký...");

      // Gọi API đăng ký
      const response = await axiosInstance.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      // Đóng toast loading
      toast.dismiss();

      console.log("Register response:", response.data);

      // Kiểm tra phản hồi từ Laravel
      if (response.data && response.data.status) {
        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đăng ký thành công!",
          text: response.data.message || "Tài khoản đã được tạo thành công",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          router.push("/auth");
        }, 1500);
      } else {
        // Xử lý trường hợp đăng ký không thành công
        Swal.fire({
          title: "Đăng ký thất bại",
          text: response.data.message || "Không thể tạo tài khoản",
          icon: "error",
        });
      }
    } catch (error: any) {
      // Đóng toast loading
      toast.dismiss();

      console.error("Register error:", error);

      // Kiểm tra nếu là lỗi network
      if (error.message === "Network Error") {
        Swal.fire({
          title: "Không thể kết nối đến server",
          html: `
            <p>Không thể kết nối đến API server tại: <code>${API_URL}</code></p>
            <p>Vui lòng kiểm tra:</p>
            <ul class="text-left">
              <li>Laravel server đã chạy chưa</li>
              <li>URL API đã đúng chưa</li>
              <li>CORS đã được cấu hình đúng chưa</li>
            </ul>
          `,
          icon: "error",
        });
      } else if (error.response) {
        // Xử lý lỗi validation từ Laravel
        if (error.response.data.errors) {
          const errorMessages = Object.values(
            error.response.data.errors
          ).flat();
          const errorMessage = errorMessages.join("\n");

          Swal.fire({
            title: "Lỗi đăng ký",
            text: errorMessage,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Lỗi đăng ký",
            text: error.response.data.message || "Đăng ký thất bại",
            icon: "error",
          });
        }
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        Swal.fire({
          title: "Không nhận được phản hồi từ server",
          text: "Server không phản hồi. Vui lòng thử lại sau.",
          icon: "error",
        });
      } else {
        // Lỗi kết nối
        Swal.fire({
          title: "Lỗi kết nối",
          text: error.message || "Có lỗi xảy ra khi kết nối đến server",
          icon: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Xóa token và header Authorization
    setAuthToken(null);
    Cookies.remove("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];

    // Hiển thị thông báo đăng xuất thành công
    Swal.fire({
      title: "Đăng xuất thành công!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // Chuyển hướng về trang chủ ("/")
    router.push("/");
  };

  return (
    <AppContext.Provider
      value={{
        login,
        register,
        isLoading,
        authToken,
        logout,
        isServerConnected,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("myAppHook must be used within an AppProvider");
  }
  return context;
};
