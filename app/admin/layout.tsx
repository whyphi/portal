import '../globals.css'
import AdminSessionProvider from '../providers';
import { Metadata } from 'next';
import NavSidebar from '@/components/admin/NavSidebar';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Whyphi - Admin',
}


export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {

  return (
    <AuthProvider>
      <AdminSessionProvider>
        <NavSidebar />
        <div className="p-8 sm:ml-64 mt-14">
          {children}
        </div>
      </AdminSessionProvider>
    </AuthProvider>
  )
}
