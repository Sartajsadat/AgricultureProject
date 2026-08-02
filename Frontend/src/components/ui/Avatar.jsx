import './Avatar.css';

function initials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export default function Avatar({ firstName, lastName, size = 36 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials(firstName, lastName) || '?'}
    </div>
  );
}
