import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Shared Layout
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import BackToTopButton from "./components/common/BackToTop";

// Routes
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <AppRoutes />
        <BackToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
