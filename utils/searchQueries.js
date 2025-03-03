const buildProductSearchQuery = (searchTerm) => {
  // 검색어를 와일드카드 패턴으로 변환
  const buildLikePattern = (term) => {
    return term
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => `*${word}*`)
      .join(" OR ");
  };

  // 숫자와 단위를 처리하여 순수 숫자로 변환
  const normalizePrice = (priceStr) => {
    if (!priceStr) return null;
    const normalized = priceStr
      .replace(/,/g, "") // 쉼표 제거
      .replace(/만원/g, "0000") // "만원"을 숫자로 변환
      .replace(/억/g, "00000000"); // "억"을 숫자로 변환
    return parseInt(normalized, 10); // 숫자로 변환
  };

  // 검색어 분리 및 전처리
  const terms = searchTerm.split(" ").filter((word) => word.length > 0);
  const numericTerms = terms.filter((word) => /^\d+$/.test(word)); // 숫자만 추출
  const textTerms = terms.filter((word) => !/^\d+$/.test(word)); // 숫자가 아닌 것

  // 가격 범위 추출
  const priceTerms = terms.filter((word) => /[\d,]+(만원|억)?/.test(word)); // 숫자 + 단위
  const prices = priceTerms
    .map(normalizePrice)
    .filter((price) => !isNaN(price)); // 정수화된 가격

  // 최소/최대 가격 설정
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 1 ? Math.max(...prices) : 100000000;

  // 숫자, 텍스트에 따른 Like 패턴 생성
  const termsLikePattern = buildLikePattern(terms.join(" "));
  const numericLikePattern = buildLikePattern(numericTerms.join(" "));
  const textLikePattern = buildLikePattern(textTerms.join(" "));

  return {
    index: "carku_goods",
    body: {
      query: {
        function_score: {
          query: {
            bool: {
              should: [
                {
                  query_string: {
                    query: textLikePattern, // 텍스트 검색
                    fields: ["car_info"],
                    boost: 15, // 텍스트에 높은 점수
                  },
                },
                {
                  query_string: {
                    query: numericLikePattern, // 숫자 검색
                    fields: ["car_info", "year"],
                    boost: 2, // 숫자에 낮은 점수
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          functions: [
            {
              weight: 1.0, // 텍스트 기본 가중치
              filter: {
                query_string: {
                  query: textLikePattern,
                  fields: ["car_info"],
                },
              },
            },
            {
              weight: 0.5, // 숫자에 낮은 가중치
              filter: {
                query_string: {
                  query: numericLikePattern,
                  fields: ["car_info"],
                },
              },
            },
          ],
          score_mode: "sum", // 가중치 합산
          boost_mode: "multiply",
        },
      },
    },
  };
};

export default buildProductSearchQuery;
