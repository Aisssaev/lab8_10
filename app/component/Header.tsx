import React, { useState } from 'react';
import LoginModal from './LoginModal';

interface HeaderProps {
    currentLocation: string;
    onLocationChange?: (newLocation: string) => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
                                                             currentLocation = "Львів, Victoria Gardens",
                                                             onLocationChange = () => {},
                                                             onLogout = () => {},
                                                         }) => {
    const [isLocationListOpen, setIsLocationListOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const locations = [
        "Львів, Victoria Gardens"
    ];

    const toggleLocationList = () => {
        setIsLocationListOpen(!isLocationListOpen);
    };

    const handleLocationSelect = (newLocation: string) => {
        onLocationChange(newLocation);
        setIsLocationListOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <header className="mt-5 w-full text-white h-16 px-6">
            <nav className={`flex flex-row h-full justify-between bg-white/5 w-full rounded-3xl p-5`}>
                <div className="flex items-center">
                    <button className="flex flex-col justify-between h-6 w-8 mr-4" aria-label="Menu">
                        <span className="w-full h-0.5 bg-white"></span>
                        <span className="w-full h-0.5 bg-white"></span>
                        <span className="w-full h-0.5 bg-white"></span>
                    </button>

                    <img className={``} src={`/logo.svg`} alt="Multiplex Logo"/>
                </div>

                <div className="flex items-center">
                    <div
                        className="flex items-center cursor-pointer relative"
                        onClick={toggleLocationList}
                        aria-label="Change location"
                    >
                        <span className="mr-4">{currentLocation}</span>
                        <span className="inline-block w-3 h-3 border-l border-b border-white transform rotate-[-45deg] mb-1"></span>

                        {isLocationListOpen && (
                            <div className="absolute top-full z-30 left-0 mt-2 bg-white/5 text-white rounded-lg shadow-lg p-2 w-60 max-w-80">
                                <ul>
                                    {locations.map((location, idx) => (
                                        <li
                                            key={idx}
                                            className="px-3 py-2 cursor-pointer hover:bg-white/10"
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            {location}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-full bg-white/30 mx-5"></div>

                    <button
                        className="flex items-center cursor-pointer text-white font-bold group"
                        onClick={openModal}
                    >
                        Увійти
                        <img className={`rounded-full ml-3 bg-gray-500 group-hover:bg-red-500`} src={"/ava_temp1.svg"} alt="User Avatar" />
                    </button>
                </div>
            </nav>
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        </header>
    );
};

export default Header;
