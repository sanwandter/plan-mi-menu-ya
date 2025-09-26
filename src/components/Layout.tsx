import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}