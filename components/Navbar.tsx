"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Hamburger, Stairs } from "@/icons";
import Link from 'next/link'


export default function Navbar() {
  const isActive = (href: string) => {
    return href === usePathname();
  };

  const navigationTextStyle = {
    active: "font-semibold text-blue-600",
    default: "hover:text-gray-500",
  };

  return (
    <>
      <nav className="h-full px-5 items-center hidden sm:flex justify-between">
        <Link className="text-xl font-bold" href="/">
          <span className='flex flex-row gap-x-1 items-center'><Stairs />Whyphi</span>
        </Link>
        <ul className="ml-20 flex items-center space-x-10">
          <Link
            className={
              isActive("/admin")
                ? navigationTextStyle.active
                : navigationTextStyle.default
            }
            href="/admin"
          >
            Listings
          </Link>
          <Link
            className={
              isActive("/admin/add")
                ? navigationTextStyle.active
                : navigationTextStyle.default
            }
            href="/admin/add"
          >
            Add
          </Link>

        </ul>
      </nav>
      <ResponsiveNavbar />
      {/* <ExampleNav/> */}
    </>
  );
}

const ResponsiveNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return href === usePathname();
  };

  const navigationTextStyle = {
    active: "font-semibold text-blue-600",
    default: "",
  };


  return (
    <nav className="flex flex-col h-full w-full px-5 items-center sm:hidden">
      <div className="flex w-full py-4 justify-between">
        <Link className="text-xl font-bold" href="/">
          <span className='flex flex-row gap-x-1 items-center'><Stairs />tierpyo</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded inline-flex items-center">
          <Hamburger />
        </button>
      </div>
      <div id="mega-menu-full-dropdown" className={`mt-1 w-full bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600 ${menuOpen ? "max-h-40" : "max-h-0 invisible"} transition-all duration-100 ease-in-out`}>
        <div className={`grid max-w-screen-xl py-2 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 md:px-6 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <ul aria-labelledby="mega-menu-full-dropdown-button">
            <li>
              <Link href="/" className={`block px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive("/") ? navigationTextStyle.active : navigationTextStyle.default}`}>
                <div className="font-semibold">랭킹</div>
              </Link>
            </li>
            <li>
              <Link href="/matchmaking" className={`block px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive("/matchmaking") ? navigationTextStyle.active : navigationTextStyle.default}`}>
                <div className="font-semibold">매치메이킹</div>
              </Link>
            </li>
            <li>
              <Link href="/add" className={`block px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive("/add") ? navigationTextStyle.active : navigationTextStyle.default}`}>
                <div className="font-semibold">회사 추가</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
};