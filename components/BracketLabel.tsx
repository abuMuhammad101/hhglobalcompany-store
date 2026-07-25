export default function BracketLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex items-center px-5 py-2.5 ${className}`}>
      <span className="absolute left-0 top-0 w-2.5 h-2.5 border-l border-t border-current" />
      <span className="absolute right-0 top-0 w-2.5 h-2.5 border-r border-t border-current" />
      <span className="absolute left-0 bottom-0 w-2.5 h-2.5 border-l border-b border-current" />
      <span className="absolute right-0 bottom-0 w-2.5 h-2.5 border-r border-b border-current" />
      {children}
    </span>
  );
}
