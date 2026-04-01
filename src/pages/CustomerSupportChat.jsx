import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
// import { loginAuthStore } from "../store/loginStore";
import '../pages/scss/CustomerChat.scss';

function CustomerSupportChat() {
    const navigate = useNavigate();
    // const { user } = loginAuthStore();
    const messagesEndRef = useRef(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'system', text: '안녕하세요! 무엇을 도와드릴까요?' },
    ]);

    // 스크롤 맨 아래 유지
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메세지 보내기
    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // 간단한 자동 응답
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: 'system', text: '상담원이 확인 후 답변드릴 예정입니다.' },
            ]);
        }, 900);
    };

    // 엔터로 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className='sub_page'>
            <div className='chat-container'>
                <div className='inner'>
                    <div className='chat-header'>
                        <Title title='1:1 고객센터' />
                    </div>

                    <div className='chat-content'>
                        {/* 왼쪽 안내 영역 */}
                        <div className='chat-left'>
                            <h2>고객센터 안내</h2>
                            <p>
                                실시간 상담은 영업일 기준 24시간 이내에 응답됩니다.
                                <br /> 문의를 남겨주시면 최대한 빠르게 도와드릴게요!
                            </p>

                            <div className='info-box'>
                                <h3>운영 시간</h3>
                                <p>평일 09:00 - 18:00 / 주말·공휴일 휴무</p>
                            </div>

                            <div className='info-box'>
                                <h3>고객센터 연락처</h3>
                                <p>
                                    전화: 1661-0677 <br />
                                    이메일: support@crocs.co.kr
                                </p>
                            </div>

                            <button className='back-btn' onClick={() => navigate(-1)}>
                                ← 뒤로가기
                            </button>
                        </div>

                        {/* 오른쪽 채팅 영역 */}
                        <div className='chat-right'>
                            <div className='chat-window'>
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`chat-message ${
                                            msg.sender === 'user' ? 'chat-user' : 'chat-system'
                                        }`}>
                                        {msg.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className='chat-input-area'>
                                <input
                                    type='text'
                                    placeholder='메세지를 입력하세요...'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onFocus={(e) => {
                                        // prevent scrolling
                                        setTimeout(() => {
                                            window.scrollTo(0, 0);
                                        }, 0);
                                    }}
                                />
                                <button onClick={sendMessage}>전송</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerSupportChat;
