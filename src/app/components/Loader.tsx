// components/Loader.tsx
import '../styles/Loader.css';

const Loader = ({ size = 'medium', color = '#3b82f6', text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div 
        className={`spinner spinner-${size}`}
        style={{ borderTopColor: color }}
      ></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
