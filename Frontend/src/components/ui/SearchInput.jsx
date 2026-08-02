import { Search } from 'lucide-react';
import './SearchInput.css';

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="search-input">
      <Search size={16} className="search-input__icon" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input__field"
      />
    </div>
  );
}
