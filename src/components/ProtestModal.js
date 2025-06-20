// src/components/ProtestModal.js

import React, { useState } from 'react';

function ProtestModal({ onClose, onSearchWord }) {
    const [word, setWord] = useState('');

    const handleSearchClick = () => {
        if (word.trim()) {
            onSearchWord(word.trim());
            // Opcional: limpiar el input después de buscar si quieres
            // setWord('');
        }
    };

    // Función para manejar el cierre del modal al hacer clic fuera
    const handleOverlayClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                    aria-label="Cerrar modal"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-bold mb-4 text-gray-800">Buscar palabra en la RAE</h3>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Escribe la palabra a buscar..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <button
                        onClick={handleSearchClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                    >
                        Buscar
                    </button>
                </div>

                <p className="text-gray-600 text-sm">
                    El resultado de la búsqueda se mostrará en la consola del navegador.
                </p>
            </div>
        </div>
    );
}

export default ProtestModal;