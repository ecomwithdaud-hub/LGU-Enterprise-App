import React from 'react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Active Students', value: '5,280+', change: '+12% this semester', color: 'text-blue-600' },
    { label: 'Faculty Members', value: '185', change: 'Across 6 faculties', color: 'text-emerald-600' },
    { label: 'Timetable Slots', value: '840/wk', change: '0 Room / Teacher Clashes', color: 'text-amber-600' },
    { label: 'Active Bus Routes', value: '14 Routes', change: 'Real-time GPS monitored', color: 'text-purple-600' },
  ];

  const modules = [
    { name: 'Timetables & Venues', desc: 'Manage room assignments, clashes, and teacher course matrix', badge: 'Active' },
    { name: 'Student Information System (SIS)', desc: 'Roll numbers, section enrollments, CGPA records & transcripts', badge: 'Active' },
    { name: 'Accounts & Fee Challans', desc: 'HBL / 1Bill voucher generation, bank reconciliation & ledger', badge: 'Active' },
    { name: 'Fleet & Transport Logistics', desc: 'Live bus tracking, GPS route optimization, and digital bus passes', badge: 'Active' },
    { name: 'Central Library System', desc: 'OPAC book catalog, RFID shelf location, and student borrow ledger', badge: 'Active' },
    { name: 'Campus Cafeteria & POS', desc: 'Digital canteen ordering, counter queue management and menu control', badge: 'Active' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="bg-[#0f2b48] text-white px-8 py-5 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-xl shadow">
              L
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Lahore Garrison University</h1>
              <p className="text-xs text-slate-300">All-in-One Enterprise Platform • SuperAdmin Console</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900 text-emerald-200 border border-emerald-700">
              ● API Engine: Connected (Port 4000)
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enterprise Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status of Lahore Garrison University multi-tier academic and administrative platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-extrabold mt-2 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Modules Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Core Operational Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((m, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">{m.name}</h4>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer / Admin Quick Links */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Backend API & Database Endpoints</h4>
          <p className="text-xs text-slate-400 mb-4">
            The NestJS API backend is equipped with OpenAPI / Swagger documentation and Prisma ORM client.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            <span className="bg-slate-800 text-emerald-400 px-3 py-1.5 rounded border border-slate-700">Swagger UI: /api/docs</span>
            <span className="bg-slate-800 text-blue-400 px-3 py-1.5 rounded border border-slate-700">Student Portal: /api/v1/students/dashboard/me</span>
            <span className="bg-slate-800 text-teal-400 px-3 py-1.5 rounded border border-slate-700">IDOR Guard: /api/v1/students/dashboard/:userId</span>
            <span className="bg-slate-800 text-amber-400 px-3 py-1.5 rounded border border-slate-700">Timetables: /api/v1/timetables/my-schedule</span>
            <span className="bg-slate-800 text-purple-400 px-3 py-1.5 rounded border border-slate-700">Prisma Studio: npx prisma studio</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-8 text-center text-xs text-slate-500">
        © 2026 Lahore Garrison University (LGU) All-in-One Enterprise Platform. All rights reserved.
      </footer>
    </div>
  );
}
