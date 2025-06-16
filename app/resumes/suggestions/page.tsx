import { Suspense } from 'react';
import { SuggestionsClient } from '@/components/resume/suggestions-client'; // <-- Import component client mới
import { Loader2 } from 'lucide-react';

// Một component đơn giản để hiển thị trong lúc chờ client component tải
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      <span className="ml-2">Đang tải trang...</span>
    </div>
  );
}

export default function JobSuggestionsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuggestionsClient />
    </Suspense>
  );
}