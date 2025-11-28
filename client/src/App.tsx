import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Checker from "@/pages/Checker";
import Results from "@/pages/Results";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Plans from "@/pages/Plans";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'backdrop-blur-lg bg-black/80 border border-white/10 text-white font-mono',
            duration: 4000,
          }}
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checker" element={<Checker />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
