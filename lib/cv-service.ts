import type { Resume } from "./types"
import cvData from "@/data/cv-data.json"
import { format, parseISO, addDays } from "date-fns"
import { addResumeHistoryItem } from "./history-service"

// Số ngày trước khi CV bị xóa vĩnh viễn
const PERMANENT_DELETE_DAYS = 7

// Lấy tất cả CV (bao gồm cả CV đã xóa)
export function getAllResumes(): Resume[] {
  return (cvData.resumes as Resume[]).map((resume) => ({
    ...resume,
    // Đảm bảo các trường bắt buộc luôn có giá trị
    id: resume.id || "",
    title: resume.title || generateCVName(),
    createdAt: resume.createdAt || new Date().toISOString(),
    updatedAt: resume.updatedAt || new Date().toISOString(),
    fileUrl: resume.fileUrl || "/samples/resume-1.pdf",
    fileType: resume.fileType || "pdf",
    isFavorite: resume.isFavorite || false,
    deletedAt: resume.deletedAt || null,
    data: resume.data || {
      degree: "",
      technicalSkills: "",
      softSkills: "",
      experience: "",
    },
  }))
}

// Lấy CV đang hoạt động (không bị xóa)
export function getActiveResumes(): Resume[] {
  return getAllResumes().filter((resume) => resume.deletedAt === null)
}

// Lấy CV đã xóa
export function getDeletedResumes(): Resume[] {
  return getAllResumes().filter((resume) => resume.deletedAt !== null)
}

// Lấy CV yêu thích
export function getFavoriteResumes(): Resume[] {
  return getAllResumes().filter((resume) => resume.isFavorite && resume.deletedAt === null)
}

// Lấy CV theo ID
export function getResumeById(id: string): Resume | undefined {
  return getAllResumes().find((resume) => resume.id === id)
}

// Định dạng ngày tạo CV
export function formatResumeDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, "MMM dd, yyyy")
}

// Định dạng thời gian xóa CV
export function formatDeletedTime(dateString: string | null): string {
  if (!dateString) return ""
  const date = parseISO(dateString)
  return format(date, "h:mm a do MMMM yyyy")
}

// Kiểm tra xem CV có thể khôi phục không (chưa quá 7 ngày)
export function canRestore(resume: Resume): boolean {
  if (resume.deletedAt === null) return false
  const deletedDate = parseISO(resume.deletedAt)
  const permanentDeleteDate = addDays(deletedDate, PERMANENT_DELETE_DAYS)
  return new Date() < permanentDeleteDate
}

// Tính số ngày còn lại trước khi CV bị xóa vĩnh viễn
export function daysUntilPermanentDelete(resume: Resume): number {
  if (resume.deletedAt === null) return 0
  const deletedDate = parseISO(resume.deletedAt)
  const permanentDeleteDate = addDays(deletedDate, PERMANENT_DELETE_DAYS)
  const now = new Date()
  const msLeft = permanentDeleteDate.getTime() - now.getTime()
  return Math.ceil(msLeft / (1000 * 60 * 60 * 24))
}

// Tạo tên CV mới dựa trên ngày
export function generateCVName(): string {
  return format(new Date(), "MMM dd, yyyy")
}

// Giả lập thêm CV mới
export function addResume(data: Partial<Resume>): Resume {
  const newResume: Resume = {
    id: String(cvData.resumes.length + 1),
    title: data.title || generateCVName(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    file: data.file || "/samples/resume.pdf",
    fileUrl: data.fileUrl || "/samples/resume-1.pdf",
    fileType: data.fileType || "pdf",
    isFavorite: data.isFavorite || false,
    deletedAt: null,
    data: data.data || {
      degree: "",
      technicalSkills: "",
      softSkills: "",
      experience: "",
    },
  }

  // Add to history
  addResumeHistoryItem({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    action: "Upload",
    resumeId: newResume.id,
    resume: newResume.title,
    link: "#",
  })

  // Trong ứng dụng thực tế, bạn sẽ lưu vào database
  // Ở đây chúng ta chỉ giả lập
  return newResume
}

// Giả lập cập nhật CV
export function updateResume(id: string, data: Partial<Resume>): Resume | undefined {
  const resume = getResumeById(id)
  if (!resume) return undefined

  // Cập nhật thông tin
  const updatedResume = {
    ...resume,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  // Add to history
  addResumeHistoryItem({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    action: "Edit",
    resumeId: id,
    resume: updatedResume.title,
    link: "#",
  })

  // Trong ứng dụng thực tế, bạn sẽ lưu vào database
  return updatedResume
}

// Giả lập xóa CV (soft delete)
export function deleteResume(id: string): Resume | undefined {
  const resume = getResumeById(id)
  if (!resume) return undefined

  // Đánh dấu là đã xóa
  const deletedResume = {
    ...resume,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add to history
  addResumeHistoryItem({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    action: "Delete",
    resumeId: id,
    resume: resume.title,
    link: "#",
  })

  // Trong ứng dụng thực tế, bạn sẽ lưu vào database
  return deletedResume
}

// Giả lập khôi phục CV
export function restoreResume(id: string): Resume | undefined {
  const resume = getResumeById(id)
  if (!resume || resume.deletedAt === null) return undefined

  // Khôi phục CV
  const restoredResume = {
    ...resume,
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  }

  // Add to history
  addResumeHistoryItem({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    action: "Restore",
    resumeId: id,
    resume: resume.title,
    link: "#",
  })

  // Trong ứng dụng thực tế, bạn sẽ lưu vào database
  return restoredResume
}

// Giả lập toggle yêu thích CV
export function toggleFavorite(id: string): Resume | undefined {
  const resume = getResumeById(id)
  if (!resume) return undefined

  // Toggle trạng thái yêu thích
  const updatedResume = {
    ...resume,
    isFavorite: !resume.isFavorite,
    updatedAt: new Date().toISOString(),
  }

  // Add to history
  addResumeHistoryItem({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    action: updatedResume.isFavorite ? "Favorite" : "Unfavorite",
    resumeId: id,
    resume: resume.title,
    link: "#",
  })

  // Trong ứng dụng thực tế, bạn sẽ lưu vào database
  return updatedResume
}
