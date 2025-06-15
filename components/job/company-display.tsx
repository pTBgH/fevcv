// components/job/CompanyDisplay.tsx
interface CompanyDisplayProps {
  companyName: string;
}

export function CompanyDisplay({ companyName }: CompanyDisplayProps) {
  const initial = companyName?.[0]?.toUpperCase() || "?";
  const nameParts = companyName.split(" ");

  return (
    <div className="flex items-center space-x-3">
  {/* Logo: chữ cái đầu */}
  <div className="h-12 w-12 rounded bg-black text-white flex items-center justify-center text-lg font-semibold flex-shrink-0">
    {initial}
  </div>
  {/* Tên công ty: 2 dòng, cao bằng logo */}
  <div className="flex-1 h-12 overflow-hidden pr-28">
    <div className="font-normal text-lg leading-6 line-clamp-2">
      {companyName}
    </div>
  </div>
</div>
  );
}
