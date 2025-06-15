// file: lib/routes.ts

// Định nghĩa một kiểu cho các link chính để có thể lặp qua
export interface NavLink {
  href: string;
  labelKey: keyof typeof defaultLabels; // Key để tra cứu trong file dịch
}

// Các nhãn mặc định (fallback)
const defaultLabels = {
  about: "About",
  searchJobs: "Search by Jobs",
  faqs: "FAQs",
  profile: "Profile",
  settings: "Settings",
  logout: "Log out",
};

// Object chứa tất cả các đường dẫn của ứng dụng
export const AppRoutes = {
  home: "/",
  signIn: "/api/auth/signin", // NextAuth sẽ tự xử lý
  signOut: "/api/auth/signout", // NextAuth sẽ tự xử lý

  // Main Navigation Links
  profiles: "/profiles",
  services: "/services", // Giả sử bạn có trang này
  search: "/search",
  help: "/dashboard/help",
  
  // User Dropdown Menu Links
  settings: "/settings",
  
  // Resume related
  resumeEditor: (cvId?: string) => cvId ? `/resumes/editor?cvId=${cvId}` : '/resumes/editor',
  resumeSuggestions: (cvId?: string) => cvId ? `/resumes/suggestions?cvId=${cvId}` : '/resumes/suggestions',
  
  // Dashboard
  dashboard: "/dashboard",
  favoriteJobs: "/favorite-jobs",
  archivedJobs: "/archived-jobs",
};

// Mảng chứa các link cho thanh điều hướng chính, dễ dàng lặp qua để render
export const mainNavLinks: NavLink[] = [
  { href: AppRoutes.profiles, labelKey: "about" },
  { href: AppRoutes.help, labelKey: "faqs" },
];

// Mảng chứa các link cho menu người dùng
export const userMenuItems = {
    profile: { href: AppRoutes.profiles, labelKey: 'profile', icon: 'UserIcon' },
    settings: { href: AppRoutes.settings, labelKey: 'settings', icon: 'Settings' },
    logout: { href: '#', labelKey: 'logout', icon: 'LogOut' }, // href là '#' vì nó gọi hàm signOut
};