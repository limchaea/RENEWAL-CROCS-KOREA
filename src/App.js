import './App.scss';
import { useEffect, useState } from 'react';
import { loginAuthStore } from './store/loginStore';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Brand from './pages/Brand';
import Login from './pages/Login';
import Join from './pages/Join';
import Coupons from './components/Coupons';
import UserInfo from './pages/UserInfo';
import MyPage from './pages/MyPage';
import OrderHistory from './pages/OrderHistory';
import OrderInfoDetail from './pages/OrderInfoDetail';
import CrocsClubPopup from './components/CrocsClubPopup';
import Nonmember from './pages/Nonmember';
import ComeAsPopup from './components/ComeAsPopup';
import ProductListPage from './pages/ProductListPage';
import CrocsProductDetail from './pages/CrocsProductDetail';
import Store from './pages/Store';
import WishList from './pages/WishList';
import Cart from './pages/Cart';
import CartSidebar from './components/CartSidebar';
import RecentProducts from './pages/RecentProducts';
import RecentSidebar from './components/RecentSidebar';
import Order from './components/Order/Order';
import JibbitzProductDetail from './pages/JibbitzProductDetail';
import JibbitzProductListPage from './pages/JibbitzProductListPage';
import Footer from './components/Footer';
import CustomerService from './components/CustomerService';
import CustomerSupportChat from './pages/CustomerSupportChat';

function App() {
    const { loading, checkSession, initAuthListener } = loginAuthStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isRecentOpen, setIsRecentOpen] = useState(false);
    const location = useLocation();
    const [isCSOpen, setIsCSOpen] = useState(false);

    // Main 페이지인지 확인
    const isMainPage = location.pathname === '/';

    // 페이지 이동 시 장바구니 닫기 + 최근본상품 닫기
    useEffect(() => {
        setIsCartOpen(false);
        setIsRecentOpen(false);
    }, [location.pathname]);

    // 장바구니 클릭
    const handleCartClick = () => {
        setIsCartOpen((prev) => !prev);
        if (!isCartOpen && isRecentOpen) setIsRecentOpen(false); // recent 닫기
    };

    // 최근본상품 클릭
    const handleRecentClick = () => {
        setIsRecentOpen((prev) => !prev);
        if (!isRecentOpen && isCartOpen) setIsCartOpen(false); // cart 닫기
    };

    // CS 센터 모달 열기
    const openCS = () => {
        setIsCSOpen(true);
        document.body.classList.add('no-scroll');
    };

    // CS 센터 모달 닫기
    const closeCS = () => {
        setIsCSOpen(false);
        document.body.classList.remove('no-scroll');
    };

    // Firebase 세션 복원
    useEffect(() => {
        initAuthListener();
    }, [initAuthListener]);

    // 1분마다 세션 만료 체크
    useEffect(() => {
        const timer = setInterval(() => {
            checkSession();
        }, 60000);
        return () => clearInterval(timer);
    }, [checkSession]);

    if (loading) return <h3>로딩 중...</h3>;

    return (
        <div className='App'>
            <Header
                onCartClick={() => handleCartClick(true)}
                onRecentClick={() => handleRecentClick(true)}
            />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <RecentSidebar isOpen={isRecentOpen} onClose={() => setIsRecentOpen(false)} />
            <Routes>
                <Route index element={<Main />} />
                <Route path='/store' element={<Store />} />
                <Route path='/Brand' element={<Brand />} />
                <Route path='/login' element={<Login />} />
                <Route path='/join' element={<Join />} />
                <Route path='/all' element={<ProductListPage />} />
                <Route path='/:cate/:subcategory?' element={<ProductListPage />} />
                <Route path='/crocsclub' element={<CrocsClubPopup />} />
                <Route path='/userinfo' element={<UserInfo />} />
                <Route path='/nonmember' element={<Nonmember />} />
                <Route path='/comaspopup' element={<ComeAsPopup />} />
                <Route path='/product/:id' element={<CrocsProductDetail />} />
                <Route path='/orderhistory' element={<OrderHistory />} />
                <Route path='/wishlist' element={<WishList />} />
                <Route path='/jibbitz/detail/:id' element={<JibbitzProductDetail />} />
                <Route path='/jibbitz/:filter' element={<JibbitzProductListPage />} />
                <Route path='/jibbitz' element={<JibbitzProductListPage />} />
                <Route path='/all/jibbitz' element={<JibbitzProductListPage />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<Order />} />
                <Route path='/orderInfoDetail' element={<OrderInfoDetail />} />
                <Route path='/coupons' element={<Coupons />} />
                <Route path='/recent' element={<RecentProducts />} />
                <Route path='/mypage' element={<MyPage />} />
                <Route path='/customer-support' element={<CustomerSupportChat />} />
            </Routes>
            {/* Main 페이지가 아닐 때만 Footer 표시 */}
            {!isMainPage && <Footer onOpenCS={openCS} />}

            {/* CS 모달 */}
            {isCSOpen && (
                <div className='cs-modal-bg' onClick={closeCS}>
                    <div className='cs-modal' onClick={(e) => e.stopPropagation()}>
                        <button className='cs-close-btn' onClick={closeCS}>
                            ×
                        </button>
                        <CustomerService onClose={closeCS} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
