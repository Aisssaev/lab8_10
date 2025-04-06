// // components/PanelElement.tsx
//
// import React, { useState, useEffect } from 'react';
// import { MovieCardProps } from './MovieCard';
// import axios from 'axios';
//
// const PanelElement = () => {
//     const [movies, setMovies] = useState<MovieCardProps[]>([]);
//     const [newMovie, setNewMovie] = useState<MovieCardProps>({
//         title: '',
//         ageRating: '',
//         posterUrl: '',
//         showtimes: [],
//     });
//
//     // Получение существующих карточек из базы данных
//     useEffect(() => {
//         const fetchMovies = async () => {
//             try {
//                 const response = await fetch('/api/get-data');
//                 const data = await response.json();
//                 setMovies(data);
//             } catch (error) {
//                 console.error('Ошибка при получении фильмов:', error);
//             }
//         };
//
//         fetchMovies();
//     }, []);
//
//     // Обработчик отправки новой карточки
//     const handleAddMovie = async () => {
//         try {
//             const response = await axios.post('/api/add-data', newMovie);
//             setMovies([...movies, response.data]); // Добавляем новую карточку в список
//             setNewMovie({ title: '', ageRating: '', posterUrl: '', showtimes: [] }); // Очистка формы
//         } catch (error) {
//             console.error('Ошибка при добавлении фильма:', error);
//         }
//     };
//
//     return (
//         <div>
//             <h1>Админ панель</h1>
//
//             <h2>Существующие фильмы</h2>
//             <div className="movie-list">
//                 {movies.map((movie, index) => (
//                     <div key={index} className="movie-card">
//                         <h3>{movie.title}</h3>
//                         <p>{movie.ageRating}</p>
//                         <img src={movie.posterUrl} alt={movie.title} width={150} />
//                         <ul>
//                             {movie.showtimes.map((time, idx) => (
//                                 <li key={idx}>{time}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))}
//             </div>
//
//             <h2>Добавить новый фильм</h2>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Название"
//                     value={newMovie.title}
//                     onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Возрастной рейтинг"
//                     value={newMovie.ageRating}
//                     onChange={(e) => setNewMovie({ ...newMovie, ageRating: e.target.value })}
//                 />
//                 <input
//                     type="text"
//                     placeholder="URL постера"
//                     value={newMovie.posterUrl}
//                     onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Время сеансов (через запятую)"
//                     value={newMovie.showtimes.join(', ')}
//                     onChange={(e) => setNewMovie({ ...newMovie, showtimes: e.target.value.split(',').map(item => item.trim()) })}
//                 />
//                 <button onClick={handleAddMovie}>Добавить фильм</button>
//             </div>
//         </div>
//     );
// };
//
// export default PanelElement;
