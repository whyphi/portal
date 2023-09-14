"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

const Hamburger = () => {
  return (
    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const Stairs = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path d="M3555 4423 c-167 -24 -322 -121 -414 -258 -89 -133 -95 -163 -99 -507 l-3 -298 -378 0 c-422 0 -468 -6 -594 -72 -80 -42 -193 -155 -235 -235 -63 -119 -72 -183 -72 -490 l0 -273 -388 0 c-426 0 -449 -2 -572 -62 -99 -48 -209 -162 -259 -269 -59 -125 -63 -163 -59 -599 l3 -385 33 -67 c40 -82 119 -157 200 -190 l57 -23 1685 0 c1608 0 1688 1 1745 18 197 61 345 202 406 389 l24 73 0 1485 0 1485 -33 67 c-40 83 -119 158 -200 190 -56 22 -66 23 -437 24 -209 1 -393 0 -410 -3z m744 -330 l21 -18 -2 -1435 -3 -1435 -22 -40 c-28 -52 -88 -109 -138 -132 -38 -17 -126 -18 -1674 -21 -1456 -2 -1637 -1 -1658 13 l-23 15 0 353 c0 394 2 411 67 486 19 23 54 52 77 64 40 22 51 22 486 27 425 5 447 6 490 26 53 25 103 73 133 129 21 38 22 56 27 380 6 380 6 381 80 455 76 76 63 74 560 80 l445 5 49 25 c51 26 94 71 123 130 16 31 19 77 23 375 5 324 6 342 27 380 40 76 111 129 198 148 11 3 171 5 356 6 307 1 339 -1 358 -16z" />
      </g>
    </svg>
  )
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