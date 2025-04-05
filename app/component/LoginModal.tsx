import React, { useState, useEffect } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: (phoneNumber: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('+380');
    const [isValidPhone, setIsValidPhone] = useState<boolean>(false);

    useEffect(() => {
        const isValid = phoneNumber.length === 13 && /^\+380\d{9}$/.test(phoneNumber);
        setIsValidPhone(isValid);
    }, [phoneNumber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValidPhone && onLogin) {
            onLogin(phoneNumber);
        }
        if (isValidPhone) {
            onClose();
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.startsWith('+380') && (value.length <= 4 || /^\+380[0-9]*$/.test(value))) {
            setPhoneNumber(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-lg max-w-md w-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300"
                    aria-label="Закрити"
                >
                    ✕
                </button>

                <div className="flex justify-center w-full max-w-xs mx-auto mb-8 items-center">
                    <img src={`/logo.svg`} alt="Logo" />
                </div>

                <h1 className="text-3xl font-bold text-center text-white mb-4">
                    Вхід до особистого кабінету
                </h1>

                <p className="text-lg text-center text-white/80 mb-8">
                    Тут всі ваші замовлення та особиста інформація
                </p>

                <form onSubmit={handleSubmit} className="w-full">
                    <label className="block text-xl font-bold mb-3 text-white">
                        Номер мобільного
                    </label>

                    <div className="mb-6">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="+380 (00) XXX XXXX"
                            className="w-full p-4 text-lg bg-white/20 text-white border-2 border-white rounded-lg focus:outline-none focus:border-white/90"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isValidPhone}
                        className={`w-full p-4 text-xl font-bold text-white rounded-lg transition-colors ${
                            isValidPhone
                                ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                                : 'bg-gray-500 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        Продовжити
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;