import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { artisanService, type Artisan } from '../../lib/artisanService';
import { categoryService, type Category } from '../../lib/categoryService';

interface SearchWithAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  type: 'artisan' | 'category' | 'skill';
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export default function SearchWithAutocomplete({
  value,
  onChange,
  onSearch,
  placeholder = "Search artisans, specialties, or skills...",
  className = ""
}: SearchWithAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categories, setCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchSuggestions(value.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    try {
      setLoading(true);
      setShowSuggestions(true);

      // Fetch artisans that match the query
      const result = await artisanService.getArtisans({ searchTerm: query }, 5);
      
      const newSuggestions: SearchSuggestion[] = [];

      // Add artisan suggestions
      result.artisans.forEach(artisan => {
        newSuggestions.push({
          type: 'artisan',
          id: artisan.id,
          name: artisan.name,
          description: artisan.specialty,
          icon: artisan.profileImage
        });
      });

      // Add category suggestions if query matches categories from database
      const matchingCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.slug.toLowerCase().includes(query.toLowerCase())
      );

      matchingCategories.forEach(category => {
        newSuggestions.push({
          type: 'category',
          id: category.slug,
          name: category.name,
          description: `Browse ${category.name} artisans`,
          icon: category.icon || '🎨'
        });
      });

      // Add skill suggestions from artisan skills
      const allSkills = new Set<string>();
      result.artisans.forEach(artisan => {
        artisan.skills.forEach(skill => {
          if (skill.toLowerCase().includes(query.toLowerCase())) {
            allSkills.add(skill);
          }
        });
      });

      Array.from(allSkills).slice(0, 3).forEach(skill => {
        newSuggestions.push({
          type: 'skill',
          id: skill,
          name: skill,
          description: `Artisans with ${skill} skills`,
          icon: '🎨'
        });
      });

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove hardcoded getCategoryIcon function since we now use database icons

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          onSearch(value);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'artisan') {
      // Navigate to artisan profile
      window.location.href = `/artisan/${suggestion.id}`;
    } else if (suggestion.type === 'category') {
      // Navigate to category page
      window.location.href = `/categories/${suggestion.id}`;
    } else {
      // Set search term and trigger search
      onChange(suggestion.name);
      onSearch(suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-[#1C1C1C] border border-[#B08D57]/30 rounded-lg text-[#FDF6F0] placeholder-[#FDF6F0]/40 focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57]"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              <span>Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    {suggestion.type === 'artisan' && suggestion.icon && suggestion.icon.includes('cloudinary.com') ? (
                      <img
                        src={suggestion.icon}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to optimized URL if image fails
                          const target = e.currentTarget;
                          if (target.src.includes('cloudinary.com')) {
                            // Try optimized URL
                            const optimizedUrl = target.src.replace('/upload/', '/upload/w_32,h_32,c_fill,g_face,q_80,f_webp/');
                            target.src = optimizedUrl;
                          } else {
                            // Replace with fallback
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-accent-gold to-wine-red">${suggestion.name.charAt(0).toUpperCase()}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {suggestion.icon}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{suggestion.name}</div>
                    {suggestion.description && (
                      <div className="text-slate-400 text-sm">{suggestion.description}</div>
                    )}
                  </div>
                  <div className="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded-full capitalize">
                    {suggestion.type}
                  </div>
                </button>
              ))}
            </div>
          ) : value.trim().length >= 2 ? (
            <div className="p-4 text-center text-slate-400">
              <div className="text-2xl mb-2">🔍</div>
              <div>No results found for "{value}"</div>
              <div className="text-sm mt-1">Try different keywords</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
