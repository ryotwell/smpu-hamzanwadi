"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

interface LocationSearchProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
  placeholder?: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationSearch({
  onSelect,
  defaultValue = "",
  placeholder = "Cari alamat rumah...",
}: LocationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        searchLocation(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const searchLocation = async (search: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search
        )}&format=json&limit=5&addressdetails=1&countrycodes=id`,
        {
          headers: {
            "User-Agent": "SMPU-Hamzanwadi-PPDB/1.0",
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mencari lokasi");

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setQuery(result.display_name);
    setResults([]);
    setShowResults(false);
    onSelect(result.display_name, lat, lng);
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          placeholder={placeholder}
          className="pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md border shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-start gap-2 transition-colors text-sm"
              onClick={() => handleSelect(result)}
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 3 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md border shadow-lg p-4 text-center text-sm text-muted-foreground">
          Tidak ditemukan. Coba dengan kata kunci lain.
        </div>
      )}
    </div>
  );
}