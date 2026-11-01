import { NavLink } from 'react-router-dom';
import { Shirt, Sparkles, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { path: '/wardrobe', label: '衣橱', icon: Shirt },
  { path: '/try-on', label: '试穿', icon: Sparkles },
  { path: '/outfit-log', label: '记录', icon: CalendarCheck },
];

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch">
        {NAV.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs',
                isActive ? 'font-medium text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
