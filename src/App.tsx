
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Loop from "./pages/Loop";
import Receipts from "./pages/Receipts";
import Stats from "./pages/Stats";
import Pilot from "./pages/Pilot";
import Tutorial from "./pages/Tutorial";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loop" element={<Loop />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/pilot" element={<Pilot />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
