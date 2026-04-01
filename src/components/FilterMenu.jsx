import React, { useState } from 'react';
import './scss/WomenComponents.scss';

export default function FilterMenu({
    selectedColors = [],
    selectedSize = null,
    onRemoveColor,
    onRemoveSize,
    onRemoveAll, // 전체삭제 콜백
}) {
    const [isOpen] = useState(true);
    const hasFilters = selectedColors.length > 0 || selectedSize !== null;

    //   const handleToggle = (e) => {
    //     e.preventDefault();
    //     setIsOpen(!isOpen);
    //   };

    if (!hasFilters) {
        return null; // 필터가 없으면 표시 안 함
    }

    return (
        <div className='filter-menu'>
            <div className='filter-menu__wrap menu_wrap-style'>
                <div className='filter-menu__wrap--title_wrap title--wrap'>
                    <h3 className='filter-menu__wrap--title title'>필터</h3>
                    {/* 전체삭제 버튼 */}
                    <button className='filter_clear_btn' onClick={onRemoveAll}>
                        전체삭제
                    </button>
                </div>

                {isOpen && (
                    <>
                        <ul className='filter-menu__wrap filter-menu__wrap--color'>
                            {selectedColors.map((color, index) => {
                                const bgColor = Array.isArray(color.value)
                                    ? color.value[0]
                                    : color.value || color.code || color.hex || null;

                                const colorName =
                                    color.label ||
                                    color.name ||
                                    color.class ||
                                    (Array.isArray(color.value) ? color.value[0] : color.value);

                                return (
                                    <li key={`color-${index}`} className='filter-menu__item'>
                                        <div className='filter-item-content'>
                                            <div
                                                className='filter-menu__select_color'
                                                style={{ backgroundColor: bgColor }}
                                            />
                                            <span className='filter-color-name'>{colorName}</span>
                                        </div>

                                        <button
                                            className='filter-menu__close-link'
                                            onClick={() => onRemoveColor(color)}>
                                            <img
                                                src='/images/Sub_Women_Images/icon-close_cross.svg'
                                                alt='필터 제거'
                                                className='close-btn'
                                            />
                                        </button>
                                    </li>
                                );
                            })}

                            {selectedSize && (
                                <li className='filter-menu__item'>
                                    <div className='filter-item-content'>
                                        <span className='filter-size-name'>
                                            사이즈: {selectedSize}
                                        </span>
                                    </div>
                                    <button
                                        className='filter-menu__close-link'
                                        onClick={onRemoveSize}>
                                        <img
                                            src='/images/Sub_Women_Images/icon-close_cross.svg'
                                            alt='필터 제거'
                                            className='close-btn'
                                        />
                                    </button>
                                </li>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
