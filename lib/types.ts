export interface Company {
  name: string;
  logo?: string;
}

export interface Job {
  id: string;
  title: string;
  city?: string;
  district?: string;
  type?: string;
  minSalary?: number;
  maxSalary?: number; // Backend của bạn không có trường này, sẽ để là undefined
  daysLeft?: number;
  deadline?: string;
  company?: Company;
  isFavorite?: boolean;
  isArchived?: boolean;
  isHidden?: boolean;
  score?: number; // Thêm trường score
  experience_years?: number; // Giữ lại trường gốc nếu cần
}

export interface UserJobActions {
  favorites: Record<string, boolean>
  archived: Record<string, boolean>
  hidden: Record<string, boolean>
}

// Kiểu dữ liệu cho các trường thông tin được trích xuất
export interface ResumeData {
  file_path: string;
  degree: string;
  technical_skill: string;
  soft_skill: string;
  experience: string;
}

// Kiểu dữ liệu chính cho một Resume
export interface Resume {
  id: string;
  title: string;
  data: ResumeData;
  fileUrl: string;
  fileType?: string; // Thêm dấu ? nếu trường này không phải lúc nào cũng có
  isFavorite: boolean;
  isNew?: boolean; // Thêm dấu ? nếu trường này không phải lúc nào cũng có
  
  // THÊM CÁC TRƯỜNG CÒN THIẾU VÀO ĐÂY
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  exp_years?: number | 0; // Số năm kinh nghiệm
}
