import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OTPPage from "./pages/OTPPage";
import WelcomePage from "./pages/WelcomePage";
import NicknamePage from "./pages/NicknamePage";
import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import BadgeEarnedPage from "./pages/BadgeEarnedPage";
import BadgesPage from "./pages/BadgesPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<OTPPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/nickname" element={<NicknamePage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lessons"
                    element={
                        <ProtectedRoute>
                            <LessonsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lessons/:lessonId"
                    element={
                        <ProtectedRoute>
                            <LessonDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/quiz/:lessonId"
                    element={
                        <ProtectedRoute>
                            <QuizPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/quiz-result/:lessonId"
                    element={
                        <ProtectedRoute>
                            <QuizResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/badge-earned"
                    element={
                        <ProtectedRoute>
                            <BadgeEarnedPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/badges"
                    element={
                        <ProtectedRoute>
                            <BadgesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}