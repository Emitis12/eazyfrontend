import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===== Shared Components =====
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import BackToTopButton from "./components/common/BackToTop";

// ===== Landing Page Sections =====
import Hero from "./components/Hero/Herosection";
import Deliveranything from "./components/Deliver/DeliverAnything";
import City from "./components/Cities/Cities";
import Mobiledeliver from "./components/Mobile/Mobiledeliver";
import WorkTogether from "./components/Worktogether/WorkTogether";
import EmailAlert from "./components/Emailalert/EmailAlerts";

// ===== Legal Pages =====
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiesPolicy from "./pages/legal/CookiesPolicy";
import Sitemap from "./pages/legal/Sitemap";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <Routes>
          {/* === Home/Landing Page === */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Deliveranything />
                <City />
                <Mobiledeliver />
                <WorkTogether />
                <EmailAlert />
              </>
            }
          />

          {/* === Legal Pages === */}
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>

        {/* Shared elements visible on all pages */}
        <BackToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
