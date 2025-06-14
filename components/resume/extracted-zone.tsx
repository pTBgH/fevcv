"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Định nghĩa kiểu dữ liệu được sử dụng trong component này.
// Tên trường dùng snake_case để nhất quán với state ở component cha.
interface ExtractedData {
  degree: string
  technical_skill: string
  soft_skill: string
  experience: string
}

// Định nghĩa props cho component ExtractedZone
interface ExtractedZoneProps {
  customData: ExtractedData  // Bắt buộc phải có, nhận thẳng dữ liệu từ cha
  isEditing: boolean         // Trạng thái chỉnh sửa
  onDataChange: (field: keyof ExtractedData, value: string) => void // Hàm callback khi dữ liệu thay đổi
}

/**
 * Component này hiển thị các vùng thông tin đã được trích xuất từ CV.
 * Nó là một "dumb component", chỉ nhận dữ liệu và các hàm xử lý từ props.
 */
export function ExtractedZone({
  customData,
  isEditing,
  onDataChange,
}: ExtractedZoneProps) {
  const { t } = useLanguage();

  // Đơn giản chỉ cần gọi callback onDataChange đã được truyền từ component cha.
  const handleContentChange = (field: keyof ExtractedData, value: string) => {
    onDataChange(field, value);
  };

  // Kiểm tra xem có dữ liệu nào để hiển thị không.
  const isDataEmpty =
    !customData.degree &&
    !customData.technical_skill &&
    !customData.soft_skill &&
    !customData.experience;

  // Chỉ hiển thị cảnh báo khi không ở chế độ edit và không có dữ liệu.
  if (isDataEmpty && !isEditing) {
    return (
      <Alert
        variant="warning"
        className="bg-yellow-100 text-yellow-800 border-yellow-300"
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{t("resume.noExtractedData")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* 
        NOTE: Phần Personal Information đang là dữ liệu cứng (hard-coded).
        Trong tương lai, bạn cũng nên quản lý các trường này bằng state 
        giống như các trường trong "Resume Detail".
      */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <InfoField label="Name" value="Phùng Thái Bảo" />
          <InfoField label="Gender" value="Male" />
          <InfoField label="Phone number" value="0999999999" />
          <InfoField label="Date of Birth" value="11/11/2004" />
          <InfoField label="Email" value="baophungthai8@gmail.com" />
          <InfoField label="Connected Link" value="linkedin.com/in/nguyenvana" />
        </div>
      </div>

      {/* Phần chi tiết CV có thể chỉnh sửa */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Resume Detail</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            title="Degree"
            content={customData.degree}
            isEditing={isEditing}
            onContentChange={(value) => handleContentChange("degree", value)}
          />
          <EditableField
            title="Technical Skills"
            content={customData.technical_skill}
            isEditing={isEditing}
            onContentChange={(value) => handleContentChange("technical_skill", value)}
          />
          <EditableField
            title="Soft Skills"
            content={customData.soft_skill}
            isEditing={isEditing}
            onContentChange={(value) => handleContentChange("soft_skill", value)}
          />
          <EditableField
            title="Experience"
            content={customData.experience}
            isEditing={isEditing}
            onContentChange={(value) => handleContentChange("experience", value)}
          />
        </div>
      </div>
    </div>
  );
}

// Component con để hiển thị các trường có thể chỉnh sửa
function EditableField({
  title,
  content,
  isEditing,
  onContentChange,
}: {
  title: string;
  content: string;
  isEditing: boolean;
  onContentChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      {isEditing ? (
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      ) : (
        <div className="text-gray-800 whitespace-pre-wrap min-h-[40px] p-3 bg-gray-50 rounded-md border">
          {content || "—"}
        </div>
      )}
    </div>
  );
}

// Component con để hiển thị các trường thông tin cá nhân (chỉ hiển thị)
function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-base font-medium text-gray-900">{value || "—"}</span>
        </div>
    );
}

// Giờ đây bạn không cần export default nữa vì component chính là ExtractedZone