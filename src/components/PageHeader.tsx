import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 px-3 py-3 backdrop-blur">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-muted"
        aria-label="返回"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold">{title}</h1>
      {right && <div className="ml-auto">{right}</div>}
    </header>
  );
}
