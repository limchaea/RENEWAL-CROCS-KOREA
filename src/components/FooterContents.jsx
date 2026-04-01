import React from 'react';
import { Link } from 'react-router-dom';

const FooterContents = () => {
    return (
        <div className='wide_inner'>
            <ul className='footer_left'>
                <li>
                    <Link to='/store'>Store</Link>
                </li>
                <li>
                    <Link to='/Brand'>About</Link>
                </li>
                <li>
                    <Link to='#'>Privacy Policy</Link>
                </li>
            </ul>
            <div className='footer_right'>
                <div className='sns_img_box'>
                    <p>
                        <a
                            href='https://www.instagram.com/crocskorea/'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img src='/images/icon-insta.png' alt='icon-insta' />
                        </a>
                    </p>
                    <p>
                        <a
                            href='https://www.youtube.com/channel/UCIYfU7V73aPdvTlRzDK5tcg'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img src='/images/icon-youtube.png' alt='icon-youtube' />
                        </a>
                    </p>
                    <p>
                        <a
                            href='https://pf.kakao.com/_zxhxkpd'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img src='/images/icon-kakao.png' alt='icon-kakao' />
                        </a>
                    </p>
                    <p>
                        <a
                            href='https://www.tiktok.com/tag/%ED%81%AC%EB%A1%9D%EC%8A%A4'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img src='/images/icon-tiktok.png' alt='icon-tiktok' />
                        </a>
                    </p>
                </div>
                <div className='copy-text'>© 2025 Crocs Retail, LLC</div>
            </div>
        </div>
    );
};

export default FooterContents;
