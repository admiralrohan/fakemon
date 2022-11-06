import { Route, Routes, Navigate } from "react-router-dom";
import { Gyms } from "./containers/Gyms";
import { Header } from "./components/Header";
import { Gym } from "./containers/Gym";
import { Profile } from "./containers/Profile";
import { Battle } from "./containers/Battle";
import { Toastr } from "./components/Toast";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate replace to="/profile" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gyms" element={<Gyms />} />
        <Route path="/gyms/:id" element={<Gym />} />
        <Route path="/gyms/:id/battle" element={<Battle />} />
      </Routes>

      <Toastr />
    </>
  );
}

export default App;
