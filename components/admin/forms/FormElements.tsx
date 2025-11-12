
import React, { ChangeEvent } from 'react';

export const FormCard: React.FC<{
    title: string;
    children: React.ReactNode;
    onReset?: () => void;
    resetLabel?: string;
}> = ({ title, children, onReset, resetLabel="Reset Section" }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {onReset && (
                <button 
                    type="button" 
                    onClick={onReset} 
                    className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-md hover:bg-gray-300"
                >
                    {resetLabel}
                </button>
            )}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


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
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
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
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
        />
    </div>
);

interface ImageInputProps extends Omit<InputProps, 'type'> {
    onGenerate: () => void;
    onSelect: () => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ label, id, value, onChange, onGenerate, onSelect }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                placeholder="https://... or select from library"
            />
            <div className="flex gap-2 justify-end">
                 <button
                    type="button"
                    onClick={onSelect}
                    className="px-3 py-2 bg-gray-600 text-white text-xs font-semibold rounded-md hover:bg-gray-700 whitespace-nowrap"
                >
                    Select from Library
                </button>
                <button
                    type="button"
                    onClick={onGenerate}
                    className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 whitespace-nowrap"
                >
                    Generate
                </button>
            </div>
        </div>
    </div>
);
