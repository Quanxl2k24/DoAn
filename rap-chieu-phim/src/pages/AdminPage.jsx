import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/AdminHeader';
import KpiGrid from '../components/admin/KpiGrid';
import RevenueChart from '../components/admin/RevenueChart';
import TopPerformers from '../components/admin/TopPerformers';
import RecentTransactions from '../components/admin/RecentTransactions';
import AdminFooter from '../components/admin/AdminFooter';

const AdminPage = () => {
  return (
    <>
      <Sidebar />
      <main className="ml-64 p-12 min-h-screen">
        <AdminHeader />
        <KpiGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <RevenueChart />
          <TopPerformers />
        </div>
        
        <RecentTransactions />
      </main>
      <AdminFooter />
    </>
  );
};

export default AdminPage;
