'use client'
import { useState, useCallback } from 'react';

// 디바운스 유틸리티 함수
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
          debounce(async (query) => {
            if (!query.trim()) {
              setSearchResults([]);
              return;
            }

            try {
              setLoading(true);
              const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
              const data = await response.json();

              if (response.ok) {
                const products = data.items.map(item => ({
                  id: item._id,
                  ...item._source
                }));
                setSearchResults(products);
              } else {
                console.error('Search failed:', data.error);
              }
            } catch (error) {
              console.error('Search error:', error);
            } finally {
              setLoading(false);
            }
          }, 300),
          []
  );

  // input 변경 핸들러
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
          <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* 검색창 섹션 */}
              <div className="mb-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    <div className="relative">
                      <input
                              type="text"
                              value={searchQuery}
                              onChange={handleInputChange}
                              placeholder="차량을 검색하세요"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* 검색 결과 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((car) => (
                        <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          {/* 차량 이미지 */}
                          <div className="aspect-video overflow-hidden">
                            <img
                                    src={car.image_url}
                                    alt={car.car_info}
                                    className="w-full h-full object-cover"
                            />
                          </div>

                          {/* 차량 정보 */}
                          <div className="p-4">
                            <h3 className="font-bold text-lg line-clamp-2">
                              {car.car_info}
                            </h3>
                            <div className="flex items-center w-full justify-end gap-1 mb-4">
                              <p className="text-lg text-end font-bold text-blue-600">
                                {car.price}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">연식:</span>
                                  <span>{car.year}년</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">주행:</span>
                                  <span>{car.mileage}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">연료:</span>
                                  <span>{car.fuel}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">변속:</span>
                                  <span>{car.transmission}</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 mt-2 pt-2 border-t">
                                {car.contact_info}
                              </div>
                            </div>
                          </div>
                        </div>
                ))}
              </div>

              {/* 검색 결과가 없을 때 */}
              {searchQuery && !loading && searchResults.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        검색 결과가 없습니다.
                      </div>
              )}
            </div>
          </div>
  );
}