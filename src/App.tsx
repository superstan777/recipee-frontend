import "./App.css";
import { MealsList } from "./components/MealsList";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MobileSidebarMenu } from "./components/MobileMenu";
import React from "react";
import { useIsMobile } from "./hooks/useBreakpoints";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { Spinner } from "./components/ui/spinner";

import LoginPage from "./components/LoginPage";

function App() {
  const isMobile = useIsMobile();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );

  if (!user) {
    return (
      <div className="">
        <LoginPage />
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      {!isMobile && <AppSidebar />}
      {isMobile && <MobileSidebarMenu />}

      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <MealsList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
