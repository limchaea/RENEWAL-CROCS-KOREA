import React, { useEffect, useState } from 'react';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { useNavigate } from 'react-router-dom';

// 배열 섞기 함수
const shuffleTag = (tag) => {
    const newTag = [...tag];
    for (let i = newTag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTag[i], newTag[j]] = [newTag[j], newTag[i]];
    }

    return newTag;
};

const SearchLeft = () => {
    const {
        recentSearches,
        onRemoveSearch,
        onClearAll,
        setSearchWord,
        onCloseSearch,
        onAddRecentSearches,
        getHashtags, // ⬅️ store에서 가져옴
        crocsItems,
    } = useCrocsProductStore();

    const navigate = useNavigate();

    const [randomTags, setRandomTags] = useState([]);

    // 🚀 crocsItems가 로딩된 이후에만 해시태그 만들기
    useEffect(() => {
        if (!crocsItems || crocsItems.length === 0) {
            console.log('제품 데이터 없음'); // 🔍
            return;
        }

        const hashtags = getHashtags();
        if (!hashtags || hashtags.length === 0) return;

        const shuffled = shuffleTag(hashtags).slice(0, 6);
        setRandomTags(shuffled);
    }, [crocsItems, getHashtags]); // ← 핵심: crocsItems가 바뀔 때만 실행됨

    // 최근 검색어 클릭 핸들러
    const handleRecentSearchClick = (searchText) => {
        // 1. 검색어 설정하여 제품 필터링
        setSearchWord(searchText);

        // 2. 최근 검색어에 재추가 (최상단으로 이동)
        onAddRecentSearches(searchText);
    };

    // 해시태그 클릭 핸들러
    const handleHashtagClick = (hashtag) => {
        // 1. 검색어 설정하여 제품 필터링
        setSearchWord(hashtag);

        // 2. 최근 검색어에 추가
        // onAddRecentSearches(hashtag);

        // 3. 검색 모달 닫기
        onCloseSearch();

        // 4. 검색 결과 페이지로 이동
        navigate(`/all?search=${encodeURIComponent(hashtag)}`);
    };

    return (
        <>
            <div className='recent_searches_wrap'>
                <h4 className='recent_search'>Recent Searches</h4>
                <ul className='recent_search_list'>
                    {recentSearches.length > 0 ? (
                        recentSearches.map((search) => (
                            <li key={search.id}>
                                <p
                                    className='search_text'
                                    onClick={() => handleRecentSearchClick(search.inputText)}>
                                    {search.inputText}
                                </p>
                                <button onClick={() => onRemoveSearch(search.id)}>x</button>
                            </li>
                        ))
                    ) : (
                        <li className='none_searche'>최근 검색어가 없습니다.</li>
                    )}
                </ul>
                {recentSearches.length > 0 && (
                    <button className='all_clear_btn' onClick={onClearAll}>
                        전제 삭제 <span>x</span>
                    </button>
                )}
            </div>

            <div className='hashtag_wrap'>
                <h4 className='hashtag'># HASHTAG</h4>
                <div className='hashtag_list'>
                    {randomTags.map((hashtag, id) => (
                        <button
                            className='tag'
                            key={id}
                            onClick={() => handleHashtagClick(hashtag)}>
                            {`# ${hashtag.toUpperCase()}`}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchLeft;
