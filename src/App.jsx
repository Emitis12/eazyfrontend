import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Herosection";
import Deliveranything from "./components/Deliver/DeliverAnything";
import City from "./components/Cities/Cities";
import Mobiledeliver from "./components/Mobile/Mobiledeliver";
import WorkTogether from "./components/Worktogether/WorkTogether";
import Footer from "./components/Footer/Footer";
import EmailAlert from "./components/EmailAlerts";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
        <Deliveranything />
        <City />
        <Mobiledeliver />
        <WorkTogether />
        <EmailAlert />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
