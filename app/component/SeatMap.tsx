'use client';
import React, { useState } from 'react';

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
    const seatSize = { width: 20, height: 28 };
    const seatGap = 8;

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

        if (seat.status === "taken") return "bg-gray-500 cursor-not-allowed";
        if (isSelected) return "bg-green-500 hover:bg-green-600";
        return "bg-blue-500 hover:bg-blue-600";
    };

    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    return (
        <div>
            <div className="relative w-[600px] h-[400px] border bg-white mb-6">
                {seats.map((seat, index) => {
                    const top = seat.row * (seatSize.height + seatGap);
                    const left = seat.column * (seatSize.width + seatGap);

                    return (
                        <div
                            key={index}
                            onClick={() => handleSeatClick(seat)}
                            className={`absolute rounded transition ${getSeatColor(seat)}`}
                            title={`Ряд ${seat.row}, Місце ${seat.column}`}
                            style={{
                                top,
                                left,
                                width: seatSize.width,
                                height: seatSize.height,
                            }}
                        />
                    );
                })}
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
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
