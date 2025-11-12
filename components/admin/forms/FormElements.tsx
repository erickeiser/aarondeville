import React, { ChangeEvent } from 'react';

interface FormElementProps {
    label: string;
    id: string;
}

interface InputProps extends FormElementProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
        />
    </div>
);


interface TextareaProps extends FormElementProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
        />
    </div>
);

interface ImageInputProps extends Omit<InputProps, 'type'> {
    onGenerate: () => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ label, id, value, onChange, onGenerate }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="https://example.com/image.jpg"
            />
            <button
                type="button"
                onClick={onGenerate}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
                Generate
            </button>
        </div>
    </div>
);