"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Dropdown, Avatar } from "flowbite-react";
import { ListingsIcon, CreateIcon, AccountabilityIcon, AnnouncementsIcon, AlumniDBIcon } from "@/icons";

export default function NavSidebar() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${isSidebarOpen ? 'lg:pl-64' : 'lg:px-5'}`}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="/admin" className="flex ml-2 md:mr-24">
                <img src="/pct-logo.png" className="h-8 mr-3" alt="PCT Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Whyphi</span>
              </a>
            </div>
            <div className="flex items-center">
              {session ? (
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={<Avatar alt="User settings" img={session && session.user?.image as string} rounded />}
                >
                  <Dropdown.Header>
                    <span className="block text-sm">
                      {session?.user?.name}
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {session?.user?.email}
                    </span>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <button
                    className="block text-sm w-full"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </button>
                </Dropdown>
              ) : ("")}

            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/admin"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <ListingsIcon/>
                <span className="ml-3">Listings</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/create"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <CreateIcon/>
                <span className="flex-1 ml-3 whitespace-nowrap">Create</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/accountability"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AccountabilityIcon/>
                <span className="flex-1 ml-3 whitespace-nowrap">Accountability</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/announcements"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AnnouncementsIcon/>
                <span className="flex-1 ml-3 whitespace-nowrap">Announcements</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/alumni"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AlumniDBIcon/>
                <span className="flex-1 ml-3 whitespace-nowrap">Alumni Database</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
