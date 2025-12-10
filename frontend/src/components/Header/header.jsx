import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice.js";
import { logout } from "../../slices/authSlice.js";
import Logo from "../Logo/Logo.jsx";
import ProfileImage from "../ProfileImage/ProfileImage.jsx";
import Initials from "../Initials/Initials.jsx";
import useNavigationItem from "../../hooks/useNavigationItem.jsx";

function Header() {
  // --- Redux & State ---
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Custom Hook for nav items
  const [userSettingMenu, pagesNavigation] = useNavigationItem();

  // Local State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref for clicking outside the dropdown
  const dropdownRef = useRef(null);

  // --- Handlers ---

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false); // Close mobile menu if open
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // --- Render ---

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* 1. LOGO */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Logo />
          </Link>
        </div>

        {/* 2. MOBILE MENU BUTTON (Visible up to Large screens) */}
        <div className="flex">
          <button
            type="button"
            className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* 3. DESKTOP NAVIGATION (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex lg:gap-x-12">
          {pagesNavigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500 transition-colors"
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* 4. RIGHT SIDE - PROFILE & DROPDOWN */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {userInfo ? (
            <div className="relative ml-3" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-transparent p-1 text-sm focus:outline-none ring-offset-2 focus:ring-2 focus:ring-gray-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition-all">
                  {userInfo.profilePicture ? (
                    <ProfileImage imageURL={userInfo.profilePicture} />
                  ) : (
                    <Initials author={userInfo} />
                  )}
                </div>
                {/* Chevron */}
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* THE DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                  {/* User Info Header */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {userSettingMenu.map((item, index) => (
                      <Link
                        key={index}
                        to={item.to}
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.icon && (
                          <span className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500">
                            {item.icon}
                          </span>
                        )}
                        {item.text}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={logoutHandler}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {/* 5. MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl ring-1 ring-gray-900/10">
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <Link
                to="/"
                className="-m-1.5 p-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Logo />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-500 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Main nav */}
              <nav className="space-y-1">
                {pagesNavigation.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-6 h-px bg-gray-100" />

              {userInfo ? (
                <>
                  {/* Account section */}
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    My account
                  </div>

                  <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-gray-900/10">
                      {userInfo.profilePicture ? (
                        <ProfileImage imageURL={userInfo.profilePicture} />
                      ) : (
                        <Initials author={userInfo} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {userInfo.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>

                  {/* Account links */}
                  <div className="space-y-1">
                    {userSettingMenu.map((item, index) => (
                      <Link
                        key={index}
                        to={item.to}
                        className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.text}
                      </Link>
                    ))}
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={logoutHandler}
                    className="mt-4 w-full rounded-lg px-3 py-2 text-left text-base font-semibold leading-7 text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
