import "./App.css";
import { MealsList } from "./components/MealsList";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 py-2 ">
          <MealsList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
