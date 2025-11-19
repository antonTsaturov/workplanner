
import { COLORS } from '../Statistics';

const StatDetails = ({statDetails, activeUser}) => {
  
  //const department = statDetails ? statDetails[0].dept : null;
  const department =  null;
  //console.log(statDetails)
  
  return (
    <div style={{
      background: 'var(--background-secondary)',
      padding: '1.5rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)'
    }}>
      <h4 style={{ margin: '0 0 1.5rem', color: 'var(--text-primary)' }}>
        {activeUser ? `List of Tasks for ${activeUser} (${department} department)` : null}
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem',
        overflow: 'hidden'
      }}>
        {statDetails && statDetails?.map((project, index) => (
          <div
            key={project.title}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: 'var(--background-primary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              height: 'auto',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.3s ease-out',
              animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: COLORS[4],
                transition: 'transform 0.2s ease'
              }} />
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{project.title}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{project.duration} h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {project.entries} entries
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
      {`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
            height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            height: auto;
          }
        }
      `}
      </style>
    </div>
  
  )
}

export default StatDetails;
