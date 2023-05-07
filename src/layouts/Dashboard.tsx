import React from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import { Outlet } from "react-router-dom"

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-6 m-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
