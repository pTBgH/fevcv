import { Suspense } from 'react';
import { MinimalNav } from '@/components/home/minimal-nav';
import ResumeEditor from '@/components/resume/resume-editor'; // Import Client Component bạn sẽ tạo ở Bước 2
import { Loader2 } from 'lucide-react';

// Đây là một Server Component, không có "use client"
export default function ResumeEditorPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-brand-background">
      {/* Phần layout tĩnh này được render trên server */}
      <MinimalNav />

      {/* Suspense sẽ hiển thị một UI fallback trong khi chờ component bên trong nó (ResumeEditor) sẵn sàng */}
      <Suspense 
        fallback={
          <div className="flex-1 flex justify-center items-center text-lg">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Đang tải trình chỉnh sửa...
          </div>
        }
      >
        {/* Toàn bộ phần logic và UI tương tác sẽ nằm trong component này */}
        <ResumeEditor />
      </Suspense>
    </div>
  );
}