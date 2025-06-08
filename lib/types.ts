export interface Job {
  experienceLevel: string
  id: string | number
  title: string
  link: string
  type: string
  city: string | null
  category: string
  minSalary: number | null
  maxSalary: number | null
  endDate: string
  company: {
    name: string
    logo: string
  }
  daysLeft?: number
}

export interface UserJobActions {
  favorites: Record<string, boolean>
  archived: Record<string, boolean>
  hidden: Record<string, boolean>
}

// Đảm bảo type Resume phù hợp với cấu trúc JSON
export interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  deletedAt: string | null
  fileUrl: string
  fileType: string
  file?: string // Thêm trường này nếu cần
  data: {
    degree: string
    technicalSkills: string
    softSkills: string
    experience: string
  }
}
