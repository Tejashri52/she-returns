import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Resume from "@/pages/Resume";
import Skills from "@/pages/Skills";
import Interview from "@/pages/Interview";
import Chat from "@/pages/Chat";
import Story from "@/pages/Story";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/story" element={<Story />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <FloatingChat />
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </div>
  );
}

export default App;
