import { useEffect, useRef, useState } from 'react';
import MonthlyCardList from './MonthlyCardList';
import ButtonWrap from './ButtonWrap';

const MonthlyRight = ({ isActive, onClose }) => {
    const rightRef = useRef(null);
    const cursorRef = useRef(null);
    const swiperRef = useRef(null);

    const mouse = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });

    const [showBtn, setShowBtn] = useState(false);
    const [isCardHover, setIsCardHover] = useState(false);

    useEffect(() => {
        if (!cursorRef.current) return;

        cursorRef.current.textContent = isCardHover ? 'Click!' : '← Drag! →';
    });

    // swiper Drag
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const handleDragStart = () => {
            if (isCardHover) return;

            if (cursorRef.current) {
                cursorRef.current.textContent = 'Dragging!';
            }
        };

        const handleDragEnd = () => {
            if (cursorRef.current) {
                cursorRef.current.textContent = isCardHover ? 'Click!' : '← Drag! →';
            }
        };

        swiper.on('touchStart', handleDragStart);
        swiper.on('sliderMove', handleDragStart);
        swiper.on('touchEnd', handleDragEnd);

        return () => {
            swiper.off('touchStart', handleDragStart);
            swiper.off('sliderMove', handleDragStart);
            swiper.off('touchEnd', handleDragEnd);
        };
    }, [isCardHover]);

    // cursor
    const handleMouseMove = (e) => {
        const rect = rightRef.current.getBoundingClientRect();

        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = (e) => {
        if (cursorRef.current) {
            cursorRef.current.textContent = isCardHover ? 'Click!' : '← Drag! →';
        }
    };

    const handleMouseLeave = () => {
        if (cursorRef.current) {
            cursorRef.current.textContent = '← Drag! →';
        }
    };

    // 커서 애니메이션
    useEffect(() => {
        const animate = () => {
            pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
            pos.current.y += (mouse.current.y - pos.current.y) * 0.08;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
            }

            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    // close btn
    useEffect(() => {
        const rightEl = rightRef.current;
        if (!rightEl) return;

        const handleTransitionEnd = () => {
            if (isActive) setShowBtn(true);
        };

        rightEl.addEventListener('transitionend', handleTransitionEnd);

        return () => {
            rightEl.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [isActive]);

    useEffect(() => {
        if (!isActive) setShowBtn(false);
    }, [isActive]);

    return (
        <div
            className={`monthly_right ${isActive ? 'active' : ''}`}
            ref={rightRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            // onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            {isActive && (
                <div className="drag_cursor" ref={cursorRef}>
                    ← Drag! →
                </div>
            )}
            {showBtn && <ButtonWrap onClick={onClose} btnText="close" />}
            <div className="monthly_card_wrap horizontal">
                <MonthlyCardList setIsCardHover={setIsCardHover} swiperRef={swiperRef} />
            </div>
        </div>
    );
};

export default MonthlyRight;
