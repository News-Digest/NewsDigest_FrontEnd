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
