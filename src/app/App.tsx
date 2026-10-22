import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/app/routing/ProtectedRoute";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ChatPage } from "@/pages/chat/ChatPage";

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
  );
}

export default App;
