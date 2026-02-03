import DashboardStats from '@/components/DashboardStats';
import LeadTable from '@/components/LeadTable';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import { format } from 'date-fns';

export default async function DashboardPage() {
  await connectDB();
  
  const [recentLeads, stats] = await Promise.all([
    Lead.find().sort({ auditDate: -1 }).limit(10).lean(),
    Lead.aggregate([
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          averageScore: { $avg: '$score' },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
          },
          contactedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor your leads and audit results</p>
      </div>

      <DashboardStats stats={stats[0]} />

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Audits</h2>
          <a 
            href="/leads"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            View All Leads
          </a>
        </div>
        
        <LeadTable leads={recentLeads.map(lead => ({
          ...lead,
          _id: lead._id.toString(),
          auditDate: format(new Date(lead.auditDate), 'PP')
        }))} />
      </div>
    </div>
  );
}