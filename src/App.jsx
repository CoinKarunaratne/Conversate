import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Home from "./scenes/home";
import Register from "./scenes/register";
import "./App.css";
import Chat from "./components/Chat";
import Index from "./components/Index";
import Mobile from "./components/Mobile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Register />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<Index />} />
        <Route path="chat" element={<Chat />} />
      </Route>
      <Route path="/chat/mobile" element={<Mobile />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
