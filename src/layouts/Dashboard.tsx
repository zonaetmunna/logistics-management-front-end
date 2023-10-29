import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-6 m-5 mt-5 pt-5">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Dashboard
