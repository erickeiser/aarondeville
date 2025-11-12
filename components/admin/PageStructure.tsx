

import React, { useState } from 'react';
// Fix: Import useContent from hooks and availableSections from context separately.
import { availableSections } from '../../contexts/ContentContext';
import { useContent } from '../../hooks/useContent';
import { Section, SectionType } from '../../types';
import { TrashIcon } from '../Icons';

const PageStructure: React.FC = () => {
    const { content, addSection, removeSection, reorderSections } = useContent();
    const [selectedSectionType, setSelectedSectionType] = useState<SectionType>('hero');

    const handleAddSection = () => {
        addSection(selectedSectionType);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSections = [...content.sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newSections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]; // Swap
        reorderSections(newSections);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Page Structure</h2>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Section</h3>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedSectionType}
                        onChange={(e) => setSelectedSectionType(e.target.value as SectionType)}
                        className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    >
                        {availableSections.map(s => (
                            <option key={s.type} value={s.type}>{s.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddSection}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold"
                    >
                        + Add Section
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Current Sections</h3>
                <div className="space-y-3">
                    {content.sections.map((section, index) => (
                        <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
                            <div>
                                <p className="font-semibold text-gray-700">{availableSections.find(s=>s.type === section.type)?.name || section.type}</p>
                                <p className="text-xs text-gray-500">ID: {section.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === content.sections.length - 1}
                                    className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                                >
                                    ▼
                                </button>
                                <button onClick={() => removeSection(section.id)} className="p-1.5 text-red-600 hover:text-red-800">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {content.sections.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Your page has no sections. Add one above to get started.</p>
                )}
            </div>
        </div>
    );
};

export default PageStructure;