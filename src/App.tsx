import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import "./App.css"
import { RouterProvider } from "react-router-dom"
import { Routes } from "./routes/Routes"

function App() {
  return (
    <>
      <RouterProvider router={Routes} />
    </>
  )
}

export default App
