// src/App.tsx
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
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
import BookRecommendationPage from "./pages/BookRecommendationPage";
import ProtectedRoute from "./ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./state/store"; // Update this path to match your store location

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
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/books/recommend" element={<BookRecommendationPage />} />

          {/* Protected routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<ViewBooks />} />
              <Route path="/members" element={<ViewMembers />} />
              <Route path="/return-book" element={<ReturnBooks />} />
              <Route path="/genre" element={<GenreHandle />} />
            </Route>
          </Route>

          {/* Redirect any unknown routes to dashboard if authenticated, or login if not */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
