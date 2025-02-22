import { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a472a] text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold">
            Admin Dashboard
          </Link>
          <Link href="/" className="hover:text-gray-200">
            View Site
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout; 