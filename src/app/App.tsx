import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Home } from "@/src/views/Home";
import { ArticleDetail } from "@/src/views/ArticleDetail";
import { CategoryPage } from "@/src/views/CategoryPage";
import { AuthPage } from "../views/AuthPage";
import { About } from "@/src/views/About";
import { Contact } from "@/src/views/Contact";
import { Privacy } from "@/src/views/Privacy";
import { Subscription } from "@/src/views/Subscription";
import { Profile } from "@/src/views/Profile";
import { Settings } from "@/src/views/Settings";
import { AdminAuthProvider } from "@/src/lib/admin/AdminAuthContext";
import { LanguageProvider } from "@/src/lib/LanguageContext";
import { AdminLayout } from "@/src/views/admin/AdminLayout";
import { AdminLogin } from "@/src/views/admin/AdminLogin";
import { AdminDashboard } from "@/src/views/admin/AdminDashboard";
import { EditorialReview } from "@/src/views/admin/EditorialReview";
import { AdminDigests } from "@/src/views/admin/AdminDigests";
import { Subscribers } from "@/src/views/admin/Subscribers";

function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          {/* Admin console — separate chrome, JWT-gated */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="review" element={<EditorialReview />} />
            <Route path="digests" element={<AdminDigests />} />
            <Route path="subscribers" element={<Subscribers />} />
          </Route>

          {/* Everything else is the public site */}
          <Route path="/*" element={<LanguageProvider><PublicSite /></LanguageProvider>} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}
