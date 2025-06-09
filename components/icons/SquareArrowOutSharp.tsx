const ExternalSquareArrow = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  > 
    <rect x="3" y="3" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
    <line x1="10" y1="10" x2="17" y2="3" stroke="currentColor" strokeWidth="1" />
    <line x1="8" y1="3" x2="12" y2="3" stroke="#F0F0F0" strokeWidth="2" />
    <line x1="17" y1="12" x2="17" y2="8" stroke="#F0F0F0" strokeWidth="2" />
  </svg>
);

export default ExternalSquareArrow;