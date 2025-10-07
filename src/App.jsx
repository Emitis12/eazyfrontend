import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Herosection";
import Deliveranything from "./components/Deliver/DeliverAnything";
import City from "./components/Cities";
import Mobiledeliver from "./components/Mobiledeliver";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
        <Deliveranything />
        <City />
        <Mobiledeliver />
      </div>
    </Router>
  );
}

export default App;
