'use client';
import React, { useEffect, useRef, useState } from 'react';

export type Seat = {
    row: number;
    column: number;
    status: "free" | "taken" | "selected";
    price: number;
};

interface SeatMapProps {
    seats: Seat[];
}

export default function SeatMap({ seats }: SeatMapProps) {
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const seatSize = { width: 20, height: 28 };
    const seatGap = 8;

    const maxRow = Math.max(...seats.map(s => s.row));
    const maxCol = Math.max(...seats.map(s => s.column));
    const gridWidth = maxCol * (seatSize.width + seatGap);
    const gridHeight = maxRow * (seatSize.height + seatGap);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === "taken") return;

        const isSelected = selectedSeats.some(
            s => s.row === seat.row && s.column === seat.column
        );

        if (isSelected) {
            setSelectedSeats(prev =>
                prev.filter(s => !(s.row === seat.row && s.column === seat.column))
            );
        } else {
            setSelectedSeats(prev => [...prev, seat]);
        }
    };

    const getSeatColor = (seat: Seat) => {
        const isSelected = selectedSeats.some(
            s => s.row === seat.row && s.column === seat.column
        );

        if (seat.status === "taken") return "bg-gray-300 hover:bg-red-400 cursor-not-allowed";
        if (isSelected) return "bg-blue-300 hover:bg-blue-300 cursor-pointer";
        return "bg-gray-200 hover:bg-blue-200 cursor-pointer";
    };

    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="flex flex-col items-center">
            <div className={`flex flex-row items-center mb-4`}>
                <div className={`px-3 py-2 bg-gray-300 rounded cursor-pointer mr-1`} style={{
                    width: `${seatSize.width}px`,
                    height: `${seatSize.height}px`
                }}></div>
                <div className={`font-bold`}>- 170 грн</div>
            </div>
            <svg className={`w-1/2 mb-5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 806 21" fill="#061420">
                <path d="M3.2,20l-2,0.2l-0.3-4l2-0.2C136.2,5.3,269.6,0,403,0s266.8,5.3,400.2,16l2,0.2l-0.3,4l-2-0.2 C669.5,9.3,536.3,4,403,4S136.4,9.3,3.2,20z"></path>
            </svg>
            <span className={`font-bold mb-20`}>ЕКРАН</span>
            <div
                ref={containerRef}
                className="relative mb-6"
                style={{
                    width: `${gridWidth}px`,
                    height: `${gridHeight}px`,
                }}
            >
                {seats.map((seat, index) => {
                    const top = (seat.row - 1) * (seatSize.height + seatGap);
                    const left = (seat.column - 1) * (seatSize.width + seatGap);

                    return (
                        <div
                            key={index}
                            onClick={() => handleSeatClick(seat)}
                            onMouseEnter={() => setHoveredSeat(seat)}
                            onMouseLeave={() => setHoveredSeat(null)}
                            className={`absolute rounded transition ${getSeatColor(seat)}`}
                            style={{
                                top: `${top}px`,
                                left: `${left}px`,
                                width: `${seatSize.width}px`,
                                height: `${seatSize.height}px`,
                            }}
                        />
                    );
                })}

                {hoveredSeat && (
                    <div
                        className="absolute z-50 px-3 py-2 text-white text-sm bg-black rounded shadow-lg pointer-events-none"
                        style={{
                            top: (hoveredSeat.row - 1) * (seatSize.height + seatGap) - 40,
                            left: (hoveredSeat.column - 1) * (seatSize.width + seatGap) + seatSize.width / 2,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="whitespace-nowrap">
                            {hoveredSeat.row} Ряд, {hoveredSeat.column} Місце
                            <br />
                            Ціна: {hoveredSeat.price} грн
                        </div>
                        <div className="absolute left-1/2 -bottom-1 translate-x-[-50%] w-2 h-2 bg-black rotate-45"></div>
                    </div>
                )}
            </div>

            <div className="bg-gray-100 p-4 rounded shadow w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">Обрані місця:</h2>
                {selectedSeats.length === 0 ? (
                    <p className="text-gray-500">Немає обраних місць</p>
                ) : (
                    <ul className="mb-2">
                        {selectedSeats.map((s, i) => (
                            <li key={i}>
                                Ряд {s.row}, Місце {s.column} — {s.price} грн
                            </li>
                        ))}
                    </ul>
                )}
                <p className="font-semibold">Всього: {totalPrice} грн</p>
            </div>
        </div>
    );
}