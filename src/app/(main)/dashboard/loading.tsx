import DashboardLoadingSkeleton from '@/components/loadingSekeletons/dashboardLoadingSkeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen py-20">
      <DashboardLoadingSkeleton />
    </div>
  );
}
