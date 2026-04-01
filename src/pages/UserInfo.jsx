import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import UserInfoTop from '../components/UserInfoTop';
import './scss/userinfo.scss';
import { Link, useNavigate } from 'react-router-dom';
import { wishListStore } from '../store/wishListStore';
import OrderState from '../components/OrderState';
import { loginAuthStore } from '../store/loginStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useRecentProductsStore } from '../store/recentProductsStore';

const UserInfo = () => {
    const { wishLists } = wishListStore();
    const { recentProducts } = useRecentProductsStore();
    const [isWishListEmpty, setIsWishListEmpty] = useState(false);
    const [isRecentEmpty, setIsRecentEmpty] = useState(false);
    const navigate = useNavigate();

    // props로 전달할 주문 데이터
    const [orders, setOrders] = useState([]);
    const { user } = loginAuthStore();

    // 주문 데이터 불러오기
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userOrders = userData.orders || [];

                // 최신순 정렬
                const sorted = userOrders.sort((a, b) => {
                    const dateA = a.orderDate?.toDate
                        ? a.orderDate.toDate()
                        : new Date(a.orderDate);
                    const dateB = b.orderDate?.toDate
                        ? b.orderDate.toDate()
                        : new Date(b.orderDate);
                    return dateB - dateA;
                });

                setOrders(sorted);
            }
        };

        fetchOrders();
    }, [user]);

    // 위시리스트 빈 상태 체크
    useEffect(() => {
        setIsWishListEmpty(wishLists.length === 0);
    }, [wishLists]);

    // 최근 본 상품 빈 상태 체크
    useEffect(() => {
        setIsRecentEmpty(recentProducts.length === 0);
    }, [recentProducts]);

    return (
        <div className='sub_page userinfo_page'>
            <div className='inner'>
                <Title title='My Page' />
                <UserInfoTop />
                <div className='user_btn_wrap'>
                    <button onClick={() => navigate('/mypage')}>나의 정보</button>
                    <button onClick={() => navigate('/orderhistory')}>주문 정보</button>
                    <button onClick={() => navigate('/coupons')}>혜택 정보</button>
                    <button onClick={() => navigate('/customer-support')}>1 : 1 문의</button>
                </div>
                <div className='userinfo_current_order_wrap'>
                    <div className='user_menu_top'>
                        <h4>주문 처리 현황</h4>
                        <Link to='/orderhistory'>더보기</Link>
                    </div>
                    <hr />
                    <div className='user_menu_bottom'>
                        <OrderState orders={orders} />
                    </div>
                </div>
                <div className='userinfo_recentOrder_wrap'>
                    <div className='user_menu_top'>
                        <h4>최근 본 상품</h4>
                        <Link to='/recent'>더보기</Link>
                    </div>
                    <hr />
                    <div className={`user_menu_bottom ${isRecentEmpty ? 'active' : ''}`}>
                        {recentProducts.slice(0, 4).map((item) => (
                            <div key={item.id} className='wish_card'>
                                <div className='wish_card_imgbox'>
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className='wish_card_textbox'>
                                    <p>{item.name}</p>
                                    <div className='wish_card_price'>
                                        <p>
                                            <span>
                                                {item.discountPrice === ''
                                                    ? item.price
                                                    : item.discountPrice}
                                            </span>
                                            <span>
                                                {item.discountPrice === '' ? '' : item.originPrice}
                                            </span>
                                        </p>
                                        <p className='price_bottom'>{item.discountPercent}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                </div>
                <div className='userinfo_wishlist_wrap'>
                    <div className='user_menu_top'>
                        <h4>WishList</h4>
                        <Link to='/wishlist'>더보기</Link>
                    </div>
                    <hr />
                    <div className={`user_menu_bottom ${isWishListEmpty ? 'active' : ''}`}>
                        {wishLists.slice(0, 4).map((item) => (
                            <div key={item.id} className='wish_card'>
                                <div className='wish_card_imgbox'>
                                    <img src={item.imageUrl} alt={item.title} />
                                </div>
                                <div className='wish_card_textbox'>
                                    <p>{item.title}</p>
                                    <div className='wish_card_price'>
                                        <p>
                                            <span>{item.price}</span>
                                            <span>{item.price}</span>
                                        </p>
                                        <p className='price_bottom'>{item.discountPercent}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
