'use client'
import React, {use, useEffect, useState} from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'react-hot-toast';
import { MovieCardProps } from "@/app/component/MovieCard";
import HeaderSeatplan from "@/app/component/HeaderSeatplan";
import SeatMap, { Seat } from "@/app/component/SeatMap";

export default function MoviePage() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [seats, setSeats] = useState<Seat[]>([]);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showContactModal, setShowContactModal] = useState(false);
    const [ticketId, setTicketId] = useState();
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [sessionTime, setSessionTime] = useState<string>("");
    const [sessionDay, setSessionDay] = useState<string>("");
    const [hallInfo, setHallInfo] = useState<{name?: string, location?: string}>({});
    const [_id, setId] = useState<string>();

    // @ts-ignore
    const [movie, setMovie] = useState<MovieCardProps>();
    const totalPrice: number = selectedSeats.reduce((sum: number, s) => sum + s.price, 0);

    useEffect(() => {
        if (!sessionTime || !_id) return;

        const fetchHallInfo = async () => {
            try {
                const response = await axios.get(`/api/movies/${_id}/hall`, {
                    params: {
                        time: sessionTime
                    }
                });
                setHallInfo(response.data);
            } catch (error) {
                console.error("Error fetching hall info:", error);
            }
        };

        fetchHallInfo();
    }, [sessionTime, _id]);

    useEffect(() => {
        setSessionTime(localStorage.getItem("time") || "");
        setId(localStorage.getItem("id") || "");
        const fetchMovie = async () => {
            const response = await axios.get(`/api/movies/${_id}`);
            const movieData = response.data;
            setMovie(movieData);
        };

        if (_id) fetchMovie();
    }, [_id]);

    useEffect(() => {
        if (!sessionTime) return;

        const fetchSeats = async () => {
            try {
                const response = await axios.get(`/api/movies/${_id}/seats/${sessionTime}`, {
                    params: {
                        id: _id,
                        time: sessionTime
                    }
                });
                const seatData = response.data.seats.map((seat: any) => ({
                    _id: seat._id.toString(),
                    row: seat.row,
                    column: seat.column,
                    status: seat.status,
                    price: Number(seat.price)
                })) as Seat[];
                setSeats(seatData);
                if (response.data.session?.day) {
                    setSessionDay(response.data.session.day);
                }
            } catch (error) {
                console.error("Error fetching seats:", error);
            }
        };

        fetchSeats();
    }, [sessionTime, _id]);

    useEffect(() => {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, []);

    const handlePurchaseClick = () => {
        if (selectedSeats.length === 0) {
            alert('Будь ласка, оберіть місця');
            return;
        }
        setShowContactModal(true); // відкриваємо форму
    };

    const handlePurchase = async () => {
        setShowContactModal(false);
        // Email валідація (простий шаблон)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Будь ласка, введіть коректний email", { duration: 2000 });
            return;
        }

        // Телефон валідація (10+ цифр, український формат)
        const phoneRegex = /^\+?3?8?(0\d{9})$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Будь ласка, введіть коректний номер телефону", { duration: 2000 });
            return;
        }

        if (selectedSeats.length === 0) {
            toast.error("Будь ласка, оберіть місця", { duration: 2000 });
            return;
        }

        try {
            const response = await axios.post(`/api/movies/${_id}/purchase`, {
                sessionTime,
                seats: selectedSeats.map(seat => ({
                    _id: seat._id,
                    row: seat.row,
                    column: seat.column,
                    status: seat.status
                })),
                email,
                phone
            });

            const ticketId = response.data.ticketId;
            setTicketId(ticketId);
            setShowModal(true);

            const updatedSeats = seats.map(seat => {
                const isPurchased = selectedSeats.some(s => s._id === seat._id);
                return isPurchased ? { ...seat, status: 'taken' } : seat;
            });

            setSeats(updatedSeats);
            toast.success('Квитки успішно придбані!', { duration: 2000 });
        } catch (error) {
            console.error('Помилка при покупці квитків:', error);
            toast.error('Сталася помилка при покупці квитків', { duration: 2000 });
        }
    };


    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            let x = 10;
            let y = 20;
            doc.text(`Ticket ${ticketId}`, 10, 10);
            selectedSeats.map(seat => {
                doc.text(`Row ${seat.row}`, x, y);
                doc.text(`Place ${seat.column}`, x + 40, y);
                y+=10;
            })

            setSelectedSeats([])

            const qrCodeElement = document.getElementById('qrcode');
            if (!qrCodeElement) {
                throw new Error('QR-code не знайдено');
            }

            const svgData = new XMLSerializer().serializeToString(qrCodeElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);

                const imgData = canvas.toDataURL('image/SVG');
                doc.addImage(
                    imgData,
                    'SVG',
                    x,
                    y,
                    80,
                    80
                );
                doc.save(`${ticketId}.pdf`);
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            setShowModal(false);
            router.push('/');
        } catch (error) {
            toast.error('Не вдалось створити PDF!', { duration: 2000 });
        }
    };

    function getDayOfWeek(dateString: string): string {
        const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }

    return (
        <>
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Контактна інформація</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-500' : ''}`}
                        />

                        <input
                            type="tel"
                            placeholder="Телефон"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className={`w-full px-4 py-2 border rounded ${phone && !/^\+?3?8?(0\d{9})$/.test(phone) ? 'border-red-500' : ''}`}
                        />
                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                onClick={handlePurchase}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Придбати
                            </button>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
                        <h2 className="text-xl font-semibold mb-4">Квиток придбано!</h2>
                        <p className="mb-4">Бажаєте зберегти квиток у PDF?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={downloadPDF}
                                    className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700">
                                Завантажити PDF
                            </button>
                            <button onClick={() => {
                                setShowModal(false);
                                router.push('/');
                            }} className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400">
                                Ок
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex h-screen overflow-hidden">
                <div className="flex-1 flex-row overflow-y-scroll p-6">
                    <HeaderSeatplan />
                    <div className={`flex flex-row h-[30vh] gap-3 mb-10`}>
                        <div className={`max-w-40 h-60 overflow-x-hidden`}>
                            <img className={`w-full h-full object-cover`} src={movie?.posterUrl}/>
                        </div>
                        <div className={`flex flex-col`}>
                            <h1 className="text-3xl text-black/75 font-bold mb-4">{movie?.title}</h1>
                            <div className={`flex flex-row gap-4`}>
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                    </div>
                                    <div className="px-4 py-3">

                                        <div className="text-sm text-gray-600">Зал: {hallInfo.name}</div>
                                        <div className="font-bold text-lg">Львів, ТРЦ "Victoria Gardens"</div>
                                    </div>
                                </div>
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M8 7V3M16 7V3M4 11h16M5 20h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
                                        </svg>
                                    </div>
                                    <div className="px-4 py-3">
                                        <div className="text-sm text-gray-600">{sessionDay}</div>
                                        <div className="font-bold text-lg">{getDayOfWeek(sessionDay)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M12 6v6l4 2M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z" />
                                        </svg>
                                    </div>
                                    <div className="px-4 py-3">
                                        <div className="text-sm text-gray-600">Час</div>
                                        <div className="font-bold text-lg">{sessionTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SeatMap seats={seats}
                             selectedSeats={selectedSeats}
                             onSeatSelection={setSelectedSeats}/>
                </div>
                <div className="w-100 bg-white border-l shadow-lg p-6 sticky top-0 h-screen flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Квитки</h2>

                        {selectedSeats.length === 0 ? (
                            <p className="text-gray-500">Немає обраних місць</p>
                        ) : (
                            <div className="space-y-3">
                                {selectedSeats.map((s, i) => (
                                    <div key={i} className="border-gray-50 px-3 py-8 rounded-xl shadow-sm bg-gray-100 relative">
                                        <button
                                            onClick={() => setSelectedSeats(prev => prev.filter(seat => !(seat.row === s.row && seat.column === s.column)))}
                                            className="absolute top-1 right-1 text-gray-500 bg-gray-300 rounded-full p-1 cursor-pointer hover:text-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div className="flex justify-between px-6 items-start">
                                            <div className={`flex flex-row gap-5`}>
                                                <p className="font-medium">{s.row} ряд</p>
                                                <p className="font-medium">{s.column} місце</p>
                                            </div>
                                            <p className="font-bold">{s.price} грн</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-medium">Всього:</span>
                            <span className="font-bold">{totalPrice} грн</span>
                        </div>
                        <button onClick={handlePurchaseClick} className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 font-medium">
                            Продовжити
                        </button>
                    </div>
                    {ticketId && (
                        <div className="mt-6 p-4 border rounded shadow">
                            <h3 className="text-lg font-bold mb-2">Ваш квиток (QR-код):</h3>
                            <QRCodeSVG id={"qrcode"} value={`http://localhost.com/ticket?id=${ticketId}`} size={200} />
                        </div>
                    )}
                </div>
                <Toaster position="top-right" />
            </div>
        </>
    );
}
