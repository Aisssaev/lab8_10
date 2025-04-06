import React, { useState } from 'react';

const HeaderSeatplan= () => {
    return (
        <header className="mt-5 w-full text-white h-16 px-6">
            <nav className={`flex flex-row h-full justify-between bg-white/5 w-full rounded-3xl p-5`}>
                <div className="flex items-center">
                    <img className={``} src={`/logo.svg`} alt="Multiplex Logo"/>
                </div>
            </nav>
        </header>
    );
};

export default HeaderSeatplan;
