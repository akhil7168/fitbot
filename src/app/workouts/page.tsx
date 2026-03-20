import dynamic from 'next/dynamic';

const WorkoutsContent = dynamic(() => import('@/components/WorkoutsContent'), {
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

export default function WorkoutsPage() {
  return <WorkoutsContent />;
}
