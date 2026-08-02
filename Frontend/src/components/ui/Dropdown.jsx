import { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export default function Dropdown({ trigger, children, align = 'end' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className={`dropdown__menu dropdown__menu--${align}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
