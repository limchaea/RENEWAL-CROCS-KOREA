import React, { useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import SizeMenu from './SizeMenu';
import FilterMenu from './FilterMenu';
import ColorMenu from './ColorMenu';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import { useColorFilterStore } from '../store/useColorFilterStore';
import { useParams } from 'react-router-dom';
import './scss/leftNavigation.scss';

export default function LeftNavigation({ category, subcategory, selectedSize, onSizeSelect }) {
    const { crocsSizes, onFetchSize } = useCrocsSizeStore();
    const { selectedColors, toggleColor } = useColorFilterStore();
    const params = useParams();

    const finalCategory = category || params.cate || 'new';
    const finalSubcategory = subcategory || params.subcategory || null;

    useEffect(() => {
        onFetchSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRemoveColor = (color) => toggleColor(color);
    const handleRemoveSize = () => onSizeSelect?.(null);

    return (
        <div className='left_nav__section_wrap'>
            <Breadcrumbs category={finalCategory} subcategory={finalSubcategory} />
            <div className='left_nav'>
                <FilterMenu
                    selectedColors={selectedColors}
                    selectedSize={selectedSize}
                    onRemoveColor={handleRemoveColor}
                    onRemoveSize={handleRemoveSize}
                    onRemoveAll={() => {
                        // 모든 색상 초기화
                        selectedColors.forEach((color) => toggleColor(color));
                        // 사이즈 초기화
                        onSizeSelect?.(null);
                    }}
                />

                <div className='breadcrumbs__line' />

                <SizeMenu
                    sizes={crocsSizes}
                    selectedSize={selectedSize}
                    onSizeSelect={onSizeSelect}
                />

                <div className='breadcrumbs__line' />

                <ColorMenu />
                <div className='breadcrumbs__line' />
            </div>
        </div>
    );
}
