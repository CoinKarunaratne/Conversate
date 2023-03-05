import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./scenes/home";
import Register from "./scenes/register";
import "./App.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
