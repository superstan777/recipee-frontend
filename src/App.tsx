import "./App.css";
import { MealsList } from "./components/MealsList";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MobileSidebarMenu } from "./components/MobileMenu";
import React from "react";
import { useIsMobile } from "./hooks/use-mobile";

import LoginPage from "./components/LoginPage";

function App() {
  const isMobile = useIsMobile(); // <- użycie hooka

  return (
    <div className="">
      <LoginPage />
    </div>
  );

  // return (
  //   <SidebarProvider
  //     style={
  //       {
  //         "--sidebar-width": "19rem",
  //       } as React.CSSProperties
  //     }
  //   >
  //     {!isMobile && <AppSidebar />}
  //     {isMobile && <MobileSidebarMenu />}

  //     <SidebarInset>
  //       <div className="flex flex-1 flex-col">
  //         <MealsList />
  //       </div>
  //     </SidebarInset>
  //   </SidebarProvider>
  // );
}

export default App;
