import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FiMaximize, FiMinimize, FiMoon, FiSun } from "react-icons/fi"
import { FaUserCircle, FaBell, FaEnvelope } from "react-icons/fa"
import { BiMessageSquare } from "react-icons/bi"

const Navbar = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("isDarkMode") === "true",
  )
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const iconVariants = {
    open: {
      rotate: 90,
      transition: { duration: 0.2 },
    },
    closed: {
      rotate: 0,
      transition: { duration: 0.2 },
    },
  }

  // dark mode
  useEffect(() => {
    localStorage.setItem("isDarkMode", String(isDarkMode))
  }, [isDarkMode])

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  // full screen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // handle user dropdown
  const handleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  // logout handle
  const dispatch = useDispatch()

  const handleLogOut = () => {
    // dispatch(logOut())
  }

  return (
    <nav
      className={`px-4 py-3 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-dark"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* dashboard logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <span className="font-semibold text-xl ml-2">Dashboard</span>
            </Link>
          </div>
          {/*  */}
          <div className="flex justify-around items-center">
            {/* dark mode */}
            <div>
              <button className="mr-2" onClick={handleModeToggle}>
                {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
              </button>
            </div>
            {/* full screen */}
            <div className="flex items-center">
              <button
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-500"
                onClick={handleFullscreen}
              >
                {isFullscreen ? (
                  <FiMinimize className="h-6 w-6" />
                ) : (
                  <FiMaximize className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* user */}
            {/* {user?.email && ( */}
            <div className="ml-3 relative">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleUserDropdown}
                  className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="h-8 w-8 rounded-full text-gray-400" />
                </button>
                {/* <p>{user.name}</p> */}
              </div>
              {showUserDropdown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLogOut}
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
