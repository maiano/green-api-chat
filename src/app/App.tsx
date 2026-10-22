import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/app/routing/ProtectedRoute";
import { ErrorBoundary } from "@/app/ui/ErrorBoundary";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { Toaster } from "@/shared/ui/sonner";

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.credentials !== null);
  return <Navigate replace to={isAuthenticated ? "/chat" : "/login"} />;
}

function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.credentials !== null);
  return isAuthenticated ? <Navigate replace to="/chat" /> : <AuthPage />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<GuestRoute />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
