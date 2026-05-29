import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Home } from "@/src/pages/Home";
import { ArticleDetail } from "@/src/pages/ArticleDetail";
import { CategoryPage } from "@/src/pages/CategoryPage";
import { AuthPage } from "../pages/AuthPage";
import { About } from "@/src/pages/About";
import { Contact } from "@/src/pages/Contact";
import { Privacy } from "@/src/pages/Privacy";
import { Subscription } from "@/src/pages/Subscription";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
