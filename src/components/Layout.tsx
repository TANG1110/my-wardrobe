import { Outlet, useLocation } from 'react-router-dom';
import MobileTabBar from '@/components/MobileTabBar';

const HIDE_TAB = ['/add-clothing', '/body-settings'];

export const Layout = () => {
  const { pathname } = useLocation();
  const showTab = !HIDE_TAB.some((p) => pathname.startsWith(p));
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-24">{<Outlet />}</main>
      {showTab && <MobileTabBar />}
    </div>
  );
};
