import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CreateMarathon from "@/pages/CreateMarathon";
import Dashboard from "@/pages/Dashboard";
import Timeline from "@/pages/Timeline";
import Stats from "@/pages/Stats";
import Admin from "@/pages/Admin";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home — marathon selection + create */}
                <Route path="/" element={<Home />} />
                <Route path="/criar" element={<CreateMarathon />} />

                {/* Marathon screens */}
                <Route path="/marathon/:marathonId" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="stats" element={<Stats />} />
                </Route>

                {/* Admin */}
                <Route path="/admin" element={<Admin />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}