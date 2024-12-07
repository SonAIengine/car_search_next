const buildProductSearchQuery = (searchTerm) => {
  // 검색어를 와일드카드 패턴으로 변환
  const buildLikePattern = (term) => {
    return term.split(' ')
    .filter(word => word.length > 0)
    .map(word => `*${word}*`)
    .join(' OR ');
  };

  const likePattern = buildLikePattern(searchTerm);

  // 숫자와 텍스트를 분리
  const terms = searchTerm.split(' ').filter(word => word.length > 0);
  const numericTerms = terms.filter(word => /^\d+$/.test(word)); // 숫자만 추출
  const textTerms = terms.filter(word => !/^\d+$/.test(word));  // 숫자가 아닌 것

  // 숫자에 낮은 점수 적용
  const numericLikePattern = buildLikePattern(numericTerms.join(' '));
  const textLikePattern = buildLikePattern(textTerms.join(' '));

  return {
    index: 'carku_goods',
    body: {
      query: {
        function_score: {
          query: {
            bool: {
              should: [
                {
                  query_string: {
                    query: textLikePattern, // 텍스트 검색
                    fields: ['car_info'],
                    boost: 10 // 텍스트에 높은 점수
                  }
                },
                {
                  query_string: {
                    query: numericLikePattern, // 숫자 검색
                    fields: ['car_info'],
                    boost: 2 // 숫자에 낮은 점수
                  }
                }
              ],
              minimum_should_match: 1
            }
          },
          functions: [
            {
              weight: 1.0 // 텍스트 기본 가중치
            },
            {
              weight: 0.5, // 숫자에 낮은 가중치
              filter: {
                query_string: {
                  query: numericLikePattern,
                  fields: ['car_info']
                }
              }
            }
          ],
          score_mode: 'sum', // 가중치 합산
          boost_mode: 'multiply'
        }
      }
    }
  };
};

export default buildProductSearchQuery;
