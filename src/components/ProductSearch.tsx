'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './ProductSearch.css';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

interface FilterOptions {
  priceRange: [number, number];
  sortBy: 'price-low' | 'price-high' | 'newest' | 'popular';
  category?: string;
}

export default function ProductSearch({ onSearch, onFilter }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    sortBy: 'popular'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSearch} className="search-form">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="button" 
          onClick={() => setShowFilters(!showFilters)} 
          className="filter-btn"
          title="Toggle filters"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={20} />
        </button>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button 
              onClick={() => setShowFilters(false)}
              title="Close filters"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
              title="Sort products"
              aria-label="Sort products"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="price-label-row">
              <label>Price Range</label>
              <span className="price-value">₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
            </div>
            
            <div className="range-slider">
              <div className="slider-track-bg"></div>
              <div 
                className="slider-track-active"
                style={{ 
                  left: `${(filters.priceRange[0] / 10000) * 100}%`, 
                  right: `${100 - (filters.priceRange[1] / 10000) * 100}%` 
                }}
              ></div>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="50"
                value={filters.priceRange[0]}
                title="Minimum price"
                aria-label="Minimum price"
                onChange={(e) => {
                  const val = Math.min(+e.target.value, filters.priceRange[1] - 50);
                  setFilters({...filters, priceRange: [val, filters.priceRange[1]]});
                }}
              />
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="50"
                value={filters.priceRange[1]}
                title="Maximum price"
                aria-label="Maximum price"
                onChange={(e) => {
                  const val = Math.max(+e.target.value, filters.priceRange[0] + 50);
                  setFilters({...filters, priceRange: [filters.priceRange[0], val]});
                }}
              />
            </div>

            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="Min"
                min="0"
                max={filters.priceRange[1] - 50}
                value={filters.priceRange[0]}
                title="Min price input"
                aria-label="Min price input"
                onChange={(e) => setFilters({...filters, priceRange: [+e.target.value, filters.priceRange[1]]})}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max"
                min={filters.priceRange[0] + 50}
                max="10000"
                value={filters.priceRange[1]}
                title="Max price input"
                aria-label="Max price input"
                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], +e.target.value]})}
              />
            </div>
          </div>

          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
