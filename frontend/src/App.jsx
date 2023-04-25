import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes,createBrowserRouter,
  RouterProvider, } from "react-router-dom";
import { Login } from "./pages/Login/index";
import { Home } from "./pages/Home/index";
import PartySpaceSeting from './pages/PartySpaceSeting';
import MusicPlay from './pages/Music/index';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: '/party-space-seting',
      element: <PartySpaceSeting />
    },
    {
      path: '/music-play-top',
      element: <MusicPlay />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
