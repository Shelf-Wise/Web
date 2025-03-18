import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { RegistrationPage } from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ViewBooks } from "./pages/ViewBooks";
import { ViewMembers } from "./pages/ViewMembers";
import { ReturnBooks } from "./pages/ReturnBooks";
import { GenreHandle } from "./pages/ManageGenre";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Registration" element={<RegistrationPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<ViewBooks />} />
            <Route path="/members" element={<ViewMembers />} />
            {/* <Route path="/borrow-book" element={<BorrowBooks />} /> */}
            <Route path="/return-book" element={<ReturnBooks />} />
            <Route path="/genre" element={<GenreHandle />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
