import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Programs from "./pages/Programs";
import Required from "./pages/Required";
import Guide from "./pages/Guide";
import ManagerRequests from "./pages/ManagerRequests";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/required" element={<Required />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/manager-requests" element={<ManagerRequests />} />
        <Route path="/settings" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/schedule" element={<Navigate to="/guide" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
