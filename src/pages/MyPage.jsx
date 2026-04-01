import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import './scss/myPage.scss';
import { useNavigate } from 'react-router-dom';
import { loginAuthStore } from '../store/loginStore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import {
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
} from 'firebase/auth';

const MyPage = () => {
    const navigate = useNavigate();
    const { user, logout } = loginAuthStore();

    // 회원정보 상태
    const [userInfo, setUserInfo] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        postcode: '',
        detailAddress: '',
    });

    // 비밀번호 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(null);

    // 수신동의 상태
    const [emailReceive, setEmailReceive] = useState(false);
    const [smsReceive, setSmsReceive] = useState(false);
    const [privacyAgree, setPrivacyAgree] = useState(false);

    // 배송지 모달
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [tempPostcode, setTempPostcode] = useState('');
    const [tempAddress, setTempAddress] = useState('');
    const [tempDetailAddress, setTempDetailAddress] = useState('');

    // 사용자 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserInfo({
                        email: user.email || '',
                        name: userData.name || '',
                        phone: userData.phone || '',
                        address: userData.address || '',
                        postcode: userData.postcode || '',
                        detailAddress: userData.detailAddress || '',
                    });
                    setEmailReceive(userData.emailReceive || false);
                    setSmsReceive(userData.smsReceive || false);
                    setPrivacyAgree(userData.privacyAgree || false);
                }
            } catch (error) {
                console.error('사용자 정보 불러오기 실패:', error);
                alert('사용자 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchUserInfo();
    }, [user, navigate]);

    // 비밀번호 검증
    const validatePassword = (pwd) => {
        const hasLetter = /[a-zA-Z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
        const lengthValid = pwd.length >= 8 && pwd.length <= 16;
        return typeCount >= 2 && lengthValid;
    };

    // 새 비밀번호 변경 핸들러
    const handleNewPasswordChange = (e) => {
        const pwd = e.target.value;
        setNewPassword(pwd);

        if (pwd.length > 0) {
            setPasswordValid(validatePassword(pwd));
        } else {
            setPasswordValid(null);
        }

        if (confirmPassword.length > 0) {
            setPasswordMatch(pwd === confirmPassword);
        }
    };

    // 비밀번호 확인 변경 핸들러
    const handleConfirmPasswordChange = (e) => {
        const pwd = e.target.value;
        setConfirmPassword(pwd);

        if (pwd.length > 0) {
            setPasswordMatch(newPassword === pwd);
        } else {
            setPasswordMatch(null);
        }
    };

    // 우편번호 검색
    const handlePostcodeSearch = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('우편번호 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setTempPostcode(data.zonecode);
                setTempAddress(data.address);
            },
        }).open();
    };

    // 배송지 저장
    const handleSaveAddress = () => {
        setUserInfo({
            ...userInfo,
            postcode: tempPostcode,
            address: tempAddress,
            detailAddress: tempDetailAddress,
        });
        setShowAddressModal(false);
    };

    // 회원정보 수정
    const handleSubmit = async () => {
        if (!user) return;

        // 필수 입력 체크
        if (!userInfo.name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (!userInfo.phone.trim()) {
            alert('휴대전화 번호를 입력해주세요.');
            return;
        }

        // 비밀번호 변경 시 검증
        if (newPassword || confirmPassword) {
            if (!currentPassword) {
                alert('현재 비밀번호를 입력해주세요.');
                return;
            }

            if (!passwordValid) {
                alert('비밀번호 형식이 올바르지 않습니다.');
                return;
            }

            if (!passwordMatch) {
                alert('새 비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        try {
            // 비밀번호 변경이 있는 경우
            if (newPassword && currentPassword) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);

                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
            }

            // Firestore 업데이트
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                name: userInfo.name,
                phone: userInfo.phone,
                address: userInfo.address,
                postcode: userInfo.postcode,
                detailAddress: userInfo.detailAddress,
                emailReceive,
                smsReceive,
                privacyAgree,
                updatedAt: new Date(),
            });

            alert('회원정보가 수정되었습니다.');
            navigate('/userinfo');
        } catch (error) {
            console.error('회원정보 수정 실패:', error);

            if (error.code === 'auth/wrong-password') {
                alert('현재 비밀번호가 일치하지 않습니다.');
            } else if (error.code === 'auth/weak-password') {
                alert('비밀번호가 너무 약합니다.');
            } else {
                alert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    // 회원 탈퇴
    const handleDeleteAccount = async () => {
        if (!user) return;

        const confirmDelete = window.confirm(
            '정말로 회원 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.',
        );

        if (!confirmDelete) return;

        const password = window.prompt('본인 확인을 위해 비밀번호를 입력해주세요.');
        if (!password) return;

        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Firestore에서 사용자 문서 삭제
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                deleted: true,
                deletedAt: new Date(),
            });

            // Firebase Auth에서 사용자 삭제
            await deleteUser(user);

            alert('회원 탈퇴가 완료되었습니다.');
            logout();
            navigate('/');
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);

            if (error.code === 'auth/wrong-password') {
                alert('비밀번호가 일치하지 않습니다.');
            } else {
                alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className='sub_page mypage_page'>
            <div className='inner'>
                <Title title='My Info' />

                <div className='edit_form'>
                    {/* 회원정보 수정 */}
                    <div className='form_section'>
                        <h2 className='section_title'>회원정보 수정</h2>

                        <div className='form_group'>
                            <label className='form_label required'>아이디 (이메일)</label>
                            <input
                                type='text'
                                className='form_input'
                                value={userInfo.email}
                                readOnly
                            />
                            <p className='input_notice'>이메일은 변경할 수 없습니다.</p>
                        </div>

                        <div className='form_group'>
                            <label className='form_label required'>이름</label>
                            <input
                                type='text'
                                className='form_input'
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                placeholder='이름을 입력하세요'
                            />
                        </div>

                        <div className='form_group'>
                            <label className='form_label required'>휴대전화</label>
                            <input
                                type='text'
                                className='form_input'
                                value={userInfo.phone}
                                onChange={(e) =>
                                    setUserInfo({
                                        ...userInfo,
                                        phone: e.target.value.replace(/[^0-9-]/g, ''),
                                    })
                                }
                                placeholder='010-0000-0000'
                            />
                        </div>

                        <div className='form_group'>
                            <label className='form_label'>현재 비밀번호</label>
                            <input
                                type='password'
                                className='form_input'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder='비밀번호 변경 시 입력하세요'
                            />
                            <p className='input_notice'>
                                비밀번호를 변경하려면 현재 비밀번호를 입력해주세요.
                            </p>
                        </div>

                        <div className='form_group'>
                            <label className='form_label'>새 비밀번호</label>
                            <input
                                type='password'
                                className='form_input'
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                placeholder='새 비밀번호 입력'
                            />
                            {passwordValid !== null && (
                                <p
                                    className={`password_message ${
                                        passwordValid ? 'valid' : 'invalid'
                                    }`}>
                                    {passwordValid
                                        ? '✓ 사용가능한 비밀번호입니다.'
                                        : '✗ 영문/숫자/특수문자 중 2가지 이상 조합, 8~16자'}
                                </p>
                            )}
                        </div>

                        <div className='form_group'>
                            <label className='form_label'>새 비밀번호 확인</label>
                            <input
                                type='password'
                                className='form_input'
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                placeholder='새 비밀번호 재입력'
                            />
                            {passwordMatch !== null && (
                                <p
                                    className={`password_message ${
                                        passwordMatch ? 'valid' : 'invalid'
                                    }`}>
                                    {passwordMatch
                                        ? '✓ 비밀번호가 일치합니다.'
                                        : '✗ 비밀번호가 일치하지 않습니다.'}
                                </p>
                            )}
                        </div>

                        <div className='form_group'>
                            <label className='form_label'>기본 주소</label>
                            <div className='address_display'>
                                {userInfo.postcode && userInfo.address ? (
                                    <>
                                        <p className='address_text'>
                                            [{userInfo.postcode}] {userInfo.address}
                                        </p>
                                        {userInfo.detailAddress && (
                                            <p className='address_text'>{userInfo.detailAddress}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className='no_address'>등록된 배송지가 없습니다.</p>
                                )}
                            </div>
                            <button
                                type='button'
                                className='btn_address'
                                onClick={() => setShowAddressModal(true)}>
                                배송지 등록
                            </button>
                        </div>
                    </div>

                    {/* 수신 동의 */}
                    <div className='form_section'>
                        <h2 className='section_title'>수신 동의</h2>

                        <div className='checkbox_group'>
                            <label className='checkbox_label'>
                                <input
                                    type='checkbox'
                                    checked={emailReceive}
                                    onChange={(e) => setEmailReceive(e.target.checked)}
                                />
                                <span className='checkbox_text'>이메일 수신 동의</span>
                            </label>
                            <p className='checkbox_desc'>
                                프로모션, 이벤트 정보를 이메일로 받아보실 수 있습니다.
                            </p>
                        </div>

                        <div className='checkbox_group'>
                            <label className='checkbox_label'>
                                <input
                                    type='checkbox'
                                    checked={smsReceive}
                                    onChange={(e) => setSmsReceive(e.target.checked)}
                                />
                                <span className='checkbox_text'>SMS 수신 동의</span>
                            </label>
                            <p className='checkbox_desc'>
                                프로모션, 이벤트 정보를 SMS로 받아보실 수 있습니다.
                            </p>
                        </div>

                        <div className='checkbox_group'>
                            <label className='checkbox_label'>
                                <input
                                    type='checkbox'
                                    checked={privacyAgree}
                                    onChange={(e) => setPrivacyAgree(e.target.checked)}
                                />
                                <span className='checkbox_text'>
                                    개인정보 수집 및 이용동의 (선택)
                                </span>
                            </label>
                            <p className='checkbox_desc'>
                                마케팅 목적의 개인정보 수집 및 이용에 동의합니다.
                            </p>
                        </div>
                    </div>

                    {/* 회원 탈퇴 */}
                    <div className='form_section'>
                        <h2 className='section_title'>회원 탈퇴</h2>
                        <p className='delete_desc'>
                            탈퇴 시 회원님의 모든 정보가 삭제되며 복구할 수 없습니다.
                            <br />
                            신중하게 결정해주시기 바랍니다.
                        </p>
                        <button type='button' className='btn_delete' onClick={handleDeleteAccount}>
                            회원 탈퇴
                        </button>
                    </div>

                    {/* 버튼 영역 */}
                    <div className='button_wrap'>
                        <button
                            type='button'
                            className='btn_cancel'
                            onClick={() => navigate('/userinfo')}>
                            취소
                        </button>
                        <button type='button' className='btn_submit' onClick={handleSubmit}>
                            회원정보 수정
                        </button>
                    </div>
                </div>

                {/* 배송지 등록 모달 */}
                {showAddressModal && (
                    <div className='address_modal' onClick={() => setShowAddressModal(false)}>
                        <div className='modal_content' onClick={(e) => e.stopPropagation()}>
                            <div className='modal_header'>
                                <h3>배송지 등록</h3>
                                <button
                                    className='close_btn'
                                    onClick={() => setShowAddressModal(false)}>
                                    ✕
                                </button>
                            </div>

                            <div className='modal_body'>
                                <div className='form_group'>
                                    <label className='form_label'>우편번호</label>
                                    <div className='address_input_group'>
                                        <input
                                            type='text'
                                            className='form_input'
                                            value={tempPostcode}
                                            readOnly
                                            placeholder='우편번호'
                                        />
                                        <button
                                            type='button'
                                            className='btn_postcode'
                                            onClick={handlePostcodeSearch}>
                                            주소검색
                                        </button>
                                    </div>
                                </div>

                                <div className='form_group'>
                                    <label className='form_label'>기본주소</label>
                                    <input
                                        type='text'
                                        className='form_input'
                                        value={tempAddress}
                                        readOnly
                                        placeholder='기본주소'
                                    />
                                </div>

                                <div className='form_group'>
                                    <label className='form_label'>상세주소</label>
                                    <input
                                        type='text'
                                        className='form_input'
                                        value={tempDetailAddress}
                                        onChange={(e) => setTempDetailAddress(e.target.value)}
                                        placeholder='상세주소를 입력하세요'
                                    />
                                </div>
                            </div>

                            <div className='modal_footer'>
                                <button
                                    type='button'
                                    className='btn_modal_cancel'
                                    onClick={() => setShowAddressModal(false)}>
                                    취소
                                </button>
                                <button
                                    type='button'
                                    className='btn_modal_submit'
                                    onClick={handleSaveAddress}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
