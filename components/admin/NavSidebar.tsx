"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Dropdown, Avatar, Sidebar, DarkThemeToggle, useThemeMode } from "flowbite-react";
import { HiClipboardList, HiOutlineQrcode, HiFolderAdd, HiChartBar, HiDatabase, HiShare, HiMenuAlt2, HiUserGroup, HiCube, HiCubeTransparent } from "react-icons/hi";


export default function NavSidebar() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { mode } = useThemeMode();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>

      <nav className={`fixed top-0 z-50 w-full bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${isSidebarOpen ? 'lg:pl-64' : 'lg:px-5'}`}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <HiMenuAlt2 size={25}/>
              </button>
              <a href="/admin" className="flex ml-2 md:mr-24">
                <img src={mode === 'dark' ? '/pct-logo-dark.png' : '/pct-logo.png'} className="h-8 mr-3" alt="PCT Logo" />
              </a>
            </div>
            <div className="flex items-center gap-5">
              <DarkThemeToggle />
              {session ? (
                <Dropdown
                  label={<Avatar alt="User settings" img={session && session.user?.image as string} rounded />}
                  arrowIcon={false}
                  inline
                >
                  <Dropdown.Header>
                    <span className="block text-sm">{session?.user?.name}</span>
                    <span className="block truncate text-sm font-medium">{session?.user?.email}</span>
                  </Dropdown.Header>
                  <Dropdown.Item onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              ) : ("")}

            </div>
          </div>
        </div>
      </nav>

      <Sidebar
        className={`fixed z-40 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        id="logo-sidebar"
        aria-label="Sidebar"
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/admin" icon={HiClipboardList}>
              Listings
            </Sidebar.Item>
            <Sidebar.Item href="/admin/create" icon={HiFolderAdd}>
              Create
            </Sidebar.Item>
            {/* <Sidebar.Item href="/admin/accountability" icon={HiChartBar}>
              Accountability
            </Sidebar.Item> */}
            {/* <Sidebar.Item href="/admin/qr" icon={HiOutlineQrcode}>
              QR Code (Check-in)
            </Sidebar.Item> */}
            <Sidebar.Collapse icon={HiShare} label="Events">
              <Sidebar.Item href="/admin/events" icon={HiCube}>Member</Sidebar.Item>
              <Sidebar.Item href="/admin/rush" icon={HiCubeTransparent}>Rush</Sidebar.Item>
            </Sidebar.Collapse>
            {/* <Sidebar.Item href="/admin/members" icon={HiDatabase}>
              Member Database
            </Sidebar.Item> */}
            {/* <Sidebar.Item href="/admin/family-tree" icon={HiUserGroup}>
              Family Tree
            </Sidebar.Item> */}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
