
import React from 'react';
import MediaLibrary from './MediaLibrary';
import { XIcon } from '../Icons';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Select an Image</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <MediaLibrary isModal={true} onSelect={onSelect} />
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;
