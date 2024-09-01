"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Dropdown, Avatar, Sidebar, DarkThemeToggle, useThemeMode } from "flowbite-react";
import { HiClipboardList, HiOutlineQrcode, HiFolderAdd, HiChartBar, HiDatabase, HiShare, HiMenuAlt2, HiUserGroup, HiCube, HiCubeTransparent } from "react-icons/hi";


export default function PublicNavSidebar() {
  const { data: session } = useSession();
  const { mode } = useThemeMode();


  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <a className="flex ml-2 md:mr-24">
              <img src={mode === 'dark' ? '/pct-logo-dark.png' : '/pct-logo.png'} className="h-8 mr-3" alt="PCT Logo" />
            </a>
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
                  <Dropdown.Item onClick={() => signOut()}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              ) : ("")}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
