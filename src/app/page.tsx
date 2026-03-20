import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}
