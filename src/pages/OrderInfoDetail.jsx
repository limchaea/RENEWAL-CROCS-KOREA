import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginAuthStore } from '../store/loginStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import './scss/orderinfodetail.scss';
import Title from '../components/Title';

const OrderInfoDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orordNo = searchParams.get('orordNo');
    const { user } = loginAuthStore();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!user) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            if (!orordNo) {
                alert('주문번호가 없습니다.');
                navigate('/orderhistory');
                return;
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const orders = userData.orders || [];

                    console.log('전체 주문 목록:', orders);
                    console.log('찾고있는 주문번호:', orordNo);

                    const order = orders.find((o) => o.orderId === orordNo);

                    console.log('찾은 주문:', order);

                    if (order) {
                        setOrderDetail(order);
                    } else {
                        alert('주문 정보를 찾을 수 없습니다.');
                        navigate('/orderhistory');
                    }
                }
            } catch (error) {
                console.error('주문 상세 정보 불러오기 실패:', error);
                alert('주문 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [user, orordNo, navigate]);

    const formatDate = (date) => {
        if (!date) return '';
        const d = date?.toDate ? date.toDate() : new Date(date);
        return d.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: '주문접수',
            processing: '상품준비중',
            shipped: '배송중',
            delivered: '배송완료',
            cancelled: '주문취소',
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className='sub_page'>
                <div className='inner'>
                    <p>주문 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!orderDetail) {
        return null;
    }

    return (
        <div className='sub_page orderinfodetail_page'>
            <div className='inner'>
                <Title title='Order Detail' />

                <div className='order_detail_container'>
                    {/* 주문 정보 */}
                    <div className='detail_section'>
                        <div className='section_header'>
                            <h3>주문 정보</h3>
                        </div>
                        <div className='section_content'>
                            <div className='info_row'>
                                <span className='label'>주문번호</span>
                                <span className='value'>{orderDetail.orderId}</span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>주문일시</span>
                                <span className='value'>{formatDate(orderDetail.orderDate)}</span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>주문상태</span>
                                <span className={`value status ${orderDetail.status}`}>
                                    {getStatusText(orderDetail.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 주문자 정보 */}
                    <div className='detail_section'>
                        <div className='section_header'>
                            <h3>주문자 정보</h3>
                        </div>
                        <div className='section_content'>
                            <div className='info_row'>
                                <span className='label'>주문자명</span>
                                <span className='value'>
                                    {orderDetail.ordererName ||
                                        orderDetail.buyerName ||
                                        user.displayName ||
                                        '-'}
                                </span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>연락처</span>
                                <span className='value'>
                                    {orderDetail.phone || orderDetail.buyerPhone || '-'}
                                </span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>이메일</span>
                                <span className='value'>
                                    {orderDetail.email ||
                                        orderDetail.buyerEmail ||
                                        user.email ||
                                        '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 배송지 정보 */}
                    <div className='detail_section'>
                        <div className='section_header'>
                            <h3>배송지 정보</h3>
                        </div>
                        <div className='section_content'>
                            <div className='info_row'>
                                <span className='label'>수령인</span>
                                <span className='value'>
                                    {orderDetail.receiverName || orderDetail.recipientName || '-'}
                                </span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>연락처</span>
                                <span className='value'>
                                    {orderDetail.deliveryPhone || orderDetail.recipientPhone || '-'}
                                </span>
                            </div>
                            <div className='info_row'>
                                <span className='label'>배송주소</span>
                                <span className='value'>
                                    [{orderDetail.postcode || orderDetail.postalCode || ''}]{' '}
                                    {orderDetail.address || ''} {orderDetail.detailAddress || ''}
                                </span>
                            </div>
                            {orderDetail.deliveryRequest && (
                                <div className='info_row'>
                                    <span className='label'>배송요청사항</span>
                                    <span className='value'>{orderDetail.deliveryRequest}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 주문 상품 */}
                    <div className='detail_section'>
                        <div className='section_header'>
                            <h3>주문 상품</h3>
                        </div>
                        <div className='section_content products'>
                            {orderDetail.products && orderDetail.products.length > 0 ? (
                                orderDetail.products.map((product, index) => (
                                    <div key={index} className='product_item'>
                                        <div className='product_image'>
                                            <img
                                                src={product.image || '/placeholder.jpg'}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className='product_info'>
                                            <h4>{product.name}</h4>
                                            {product.size && (
                                                <p className='option'>사이즈: {product.size}</p>
                                            )}
                                            {product.color && (
                                                <p className='option'>색상: {product.color}</p>
                                            )}
                                            <p className='quantity'>수량: {product.quantity}개</p>
                                        </div>
                                        <div className='product_price'>
                                            <span className='price'>
                                                {formatPrice(product.price * product.quantity)}원
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>주문 상품 정보가 없습니다.</p>
                            )}
                        </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className='detail_section'>
                        <div className='section_header'>
                            <h3>결제 정보</h3>
                        </div>
                        <div className='section_content payment'>
                            <div className='payment_row'>
                                <span className='label'>상품금액</span>
                                <span className='value'>
                                    {formatPrice(orderDetail.subtotal || 0)}원
                                </span>
                            </div>
                            <div className='payment_row'>
                                <span className='label'>배송비</span>
                                <span className='value'>
                                    {formatPrice(orderDetail.shipping || 0)}원
                                </span>
                            </div>
                            {orderDetail.discount > 0 && (
                                <div className='payment_row discount'>
                                    <span className='label'>할인금액</span>
                                    <span className='value'>
                                        -{formatPrice(orderDetail.discount)}원
                                    </span>
                                </div>
                            )}
                            <hr />
                            <div className='payment_row total'>
                                <span className='label'>총 결제금액</span>
                                <span className='value'>
                                    {formatPrice(orderDetail.total || 0)}원
                                </span>
                            </div>
                            <div className='payment_row'>
                                <span className='label'>결제수단</span>
                                <span className='value'>
                                    {orderDetail.paymentMethod || '카드결제'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className='button_wrap'>
                        <button className='btn_secondary' onClick={() => navigate('/orderhistory')}>
                            주문내역으로
                        </button>
                        <button className='btn_primary' onClick={() => navigate('/all')}>
                            계속 쇼핑하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInfoDetail;
