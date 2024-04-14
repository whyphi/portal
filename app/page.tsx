"use client"

import React from "react";


export default function Home() {
  return (
    < section className="bg-white" >
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            // src="https://images.unsplash.com/photo-1518014179319-21e9e8139b05?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            src="https://images.unsplash.com/photo-1583339522870-0d9f28cef33f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="https://bupct.com/">
              <img
                src="/pct-logo.png"
                className="h-8 sm:h-10"
                alt="Phi Chi Theta Zeta Chapter Logo"
              />
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to WhyPhi!
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              {`WhyPhi is Phi Chi Theta Zeta Chapter's one-click dashboard application.`}
            </p>

            <div className="col-span-6">
              <a
                href={`/admin`}
                className="flex justify-center items-center px-4 py-3 mt-6 text-white bg-purple-600 rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full"
              >
                Sign In – Member
              </a>
            </div>

            <div className="col-span-6">
              <a
                // href={`/admin`}
                className={`flex justify-center items-center px-4 py-3 mt-4 text-white bg-purple-400 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full disabled:opacity-50 disabled:cursor-not-allowed`}
              // disabled // Add disabled attribute
              >
                Sign In – PNM
              </a>
            </div>

            <div className="mt-6  col-span-6">
              <p className="text-sm text-gray-500">
                Not working? Contact PCT Tech Team!
              </p>
            </div>
          </div>
        </main>
      </div>
    </section >
  );
}

