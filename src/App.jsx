import React from "react";

// Shared Layout
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import BackToTopButton from "./components/common/BackToTop";

// Routes
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AppRoutes />
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default App;
