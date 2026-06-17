import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectMarathon from "@/pages/SelectMarathon";
import Dashboard from "@/pages/Dashboard";
import Timeline from "@/pages/Timeline";
import Stats from "@/pages/Stats";
import Layout from "@/components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectMarathon />} />
        <Route path="/marathon/:marathonId" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="stats" element={<Stats />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}