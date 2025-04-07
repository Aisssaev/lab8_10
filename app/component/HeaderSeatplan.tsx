import React, { useState } from 'react';

const HeaderSeatplan= () => {
    return (
        <header className="h-[5vh] w-full text-white mb-15">
            <nav className={`flex flex-row h-full justify-between bg-black/10 py-8 px-3 w-full rounded-4xl`}>
                <div className="flex items-center">
                    <img className={`w-full h-30`} src={`/logo.svg`} alt="Multiplex Logo"/>
                </div>
            </nav>
        </header>
    );
};

export default HeaderSeatplan;
