import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ThemeInitializer from "@/components/ThemeInitializer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages for code splitting
const LandingPage = lazy(() => import("./components/ui/LandingPage"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Billing = lazy(() => import("./pages/Billing"));
const Templates = lazy(() => import("./pages/Templates"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const UsageAnalytics = lazy(() => import("./pages/UsageAnalytics"));
const HelpSupport = lazy(() => import("./pages/HelpSupport"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Auth Pages
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Onboarding Pages
const OnboardingWelcome = lazy(() => import("./pages/onboarding/Welcome"));
const OnboardingChoosePlan = lazy(() => import("./pages/onboarding/ChoosePlan"));
const OnboardingProfileSetup = lazy(() => import("./pages/onboarding/ProfileSetup"));
const OnboardingWorkspaceSetup = lazy(() => import("./pages/onboarding/WorkspaceSetup"));

// AI Tools
const WritingAssistant = lazy(() => import("./pages/ai/WritingAssistant"));
const GrammarCheck = lazy(() => import("./pages/ai/GrammarCheck"));
const AllAITools = lazy(() => import("./pages/ai/AllTools"));
const Translation = lazy(() => import("./pages/ai/Translation"));
const Summarization = lazy(() => import("./pages/ai/Summarization"));
const ContentGenerator = lazy(() => import("./pages/ai/ContentGenerator"));
const ChatAssistant = lazy(() => import("./pages/ai/ChatAssistant"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading spinner component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Public Route - redirects authenticated users to dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Auth Pages */}
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Auth Redirects for backwards compatibility */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/signin" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth?mode=signup" replace />} />
        <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
        <Route path="/auth/login" element={<Navigate to="/auth" replace />} />
        <Route path="/auth/register" element={<Navigate to="/auth?mode=signup" replace />} />
        
        {/* Onboarding (Protected) */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingWelcome /></ProtectedRoute>} />
        <Route path="/onboarding/plan" element={<ProtectedRoute><OnboardingChoosePlan /></ProtectedRoute>} />
        <Route path="/onboarding/profile" element={<ProtectedRoute><OnboardingProfileSetup /></ProtectedRoute>} />
        <Route path="/onboarding/workspace" element={<ProtectedRoute><OnboardingWorkspaceSetup /></ProtectedRoute>} />
        
        {/* Dashboard & App (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><UsageAnalytics /></ProtectedRoute>} />
        <Route path="/usage" element={<ProtectedRoute><UsageAnalytics /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
        
        {/* AI Tools (Protected) */}
        <Route path="/ai" element={<ProtectedRoute><AllAITools /></ProtectedRoute>} />
        <Route path="/ai/all-tools" element={<ProtectedRoute><AllAITools /></ProtectedRoute>} />
        <Route path="/ai/writing-assistant" element={<ProtectedRoute><WritingAssistant /></ProtectedRoute>} />
        <Route path="/ai/grammar-check" element={<ProtectedRoute><GrammarCheck /></ProtectedRoute>} />
        <Route path="/ai/translation" element={<ProtectedRoute><Translation /></ProtectedRoute>} />
        <Route path="/ai/summarization" element={<ProtectedRoute><Summarization /></ProtectedRoute>} />
        <Route path="/ai/content-generator" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
        <Route path="/ai/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ThemeInitializer />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
