import { BrowserRouter, Routes, Route } from "react-router-dom";

// import KalayApp from "./pages/kalay";
import MyProfile from "./pages/TT";
import Home from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ME" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;