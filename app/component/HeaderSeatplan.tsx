import React, { useState } from 'react';

const HeaderSeatplan= () => {
    return (
        <header className="mt-5 h-[5vh] w-full text-white px-6">
            <nav className={`flex flex-row h-full justify-between bg-white/5 w-full rounded-3xl p-5`}>
                <div className="flex items-center">
                    <img className={`w-full h-18`} src={`/logo.svg`} alt="Multiplex Logo"/>
                </div>
            </nav>
        </header>
    );
};

export default HeaderSeatplan;
