
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { IntakeFormContent, IntakeFormField, IntakeFormSection } from '../../../types';
import { TrashIcon, UserCircleIcon, TargetIcon, CalendarIcon, PaperAirplaneIcon } from '../../Icons';

interface IntakeFormFormProps {
    sectionId: string;
}

const availableDbColumns = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'age', label: 'Age' },
    { id: 'fitness_level', label: 'Fitness Level' },
    { id: 'goals', label: 'Goals' },
    { id: 'injuries', label: 'Injuries' },
    { id: 'availability', label: 'Availability' },
    { id: 'preferred_service', label: 'Preferred Service' },
    { id: 'budget', label: 'Budget' },
    { id: 'additional_info', label: 'Additional Info' },
];

const availableIcons = [
    'UserCircleIcon',
    'TargetIcon',
    'CalendarIcon',
    'PaperAirplaneIcon'
];

const IntakeFormForm: React.FC<IntakeFormFormProps> = ({ sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as IntakeFormContent;
    
    const [formData, setFormData] = useState<IntakeFormContent | undefined>(sectionData);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    // Track which section is expanded for editing
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as IntakeFormContent);
    }, [content, sectionId]);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => prev ? { ...prev, [key]: value } : undefined);
    };

    const handleSectionChange = (index: number, key: keyof IntakeFormSection, value: any) => {
        const newSections = [...formData.sections];
        newSections[index] = { ...newSections[index], [key]: value };
        setFormData(prev => prev ? { ...prev, sections: newSections } : undefined);
    };

    const handleFieldChange = (sectionIndex: number, fieldIndex: number, key: keyof IntakeFormField, value: any) => {
        const newSections = [...formData.sections];
        const newFields = [...newSections[sectionIndex].fields];
        newFields[fieldIndex] = { ...newFields[fieldIndex], [key]: value };
        newSections[sectionIndex].fields = newFields;
        setFormData(prev => prev ? { ...prev, sections: newSections } : undefined);
    };

    const addSection = () => {
        const newSection: IntakeFormSection = {
            id: `section-${Date.now()}`,
            title: 'New Section',
            icon: 'UserCircleIcon',
            fields: []
        };
        setFormData(prev => prev ? { ...prev, sections: [...prev.sections, newSection] } : undefined);
        setExpandedSection(newSection.id);
    };

    const removeSection = (index: number) => {
        if (window.confirm('Are you sure? All fields in this section will be removed.')) {
             const newSections = formData.sections.filter((_, i) => i !== index);
             setFormData(prev => prev ? { ...prev, sections: newSections } : undefined);
        }
    };

    const addField = (sectionIndex: number) => {
        const newField: IntakeFormField = {
            id: 'additional_info', // Default
            label: 'New Field',
            type: 'text',
            required: false,
            width: 'half',
            placeholder: ''
        };
        const newSections = [...formData.sections];
        newSections[sectionIndex].fields.push(newField);
        setFormData(prev => prev ? { ...prev, sections: newSections } : undefined);
    };

    const removeField = (sectionIndex: number, fieldIndex: number) => {
        const newSections = [...formData.sections];
        newSections[sectionIndex].fields.splice(fieldIndex, 1);
        setFormData(prev => prev ? { ...prev, sections: newSections } : undefined);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            setIsSaving(true);
            setStatus('Saving...');
            const success = await updateSectionContent(sectionId, formData);
            setIsSaving(false);
            if (success) {
                setStatus('Form saved successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('Save failed. Content was updated elsewhere.');
            }
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'intakeForm')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Intake Form</h2>
            
            <FormCard title="Main Settings" onReset={handleReset}>
                <Input 
                    label="Notification Email Address" 
                    id="notificationEmail" 
                    value={formData.notificationEmail || 'aarondeville@yahoo.com'} 
                    onChange={e => handleInputChange('notificationEmail', e.target.value)} 
                />
                <p className="text-xs text-gray-500 mb-4">
                    When a user submits the form, an email will be sent to this address via FormSubmit.co. 
                    <strong> Important:</strong> If you change this email, the first new submission will trigger an activation email from FormSubmit to the new address. You must click "Activate" in that email.
                </p>

                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
                <Input label="Submit Button Text" id="submitBtn" value={formData.submitButtonText} onChange={e => handleInputChange('submitButtonText', e.target.value)} />
                <Textarea label="Disclaimer" id="disclaimer" value={formData.disclaimer} onChange={e => handleInputChange('disclaimer', e.target.value)} rows={2} />
            </FormCard>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Form Sections & Fields</h3>
                {formData.sections.map((section, sIndex) => (
                    <div key={section.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                        {/* Section Header */}
                        <div className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-700">{section.title}</span>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{section.fields.length} fields</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(sIndex); }} className="text-red-500 hover:text-red-700 p-1">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                <span className="text-gray-500 text-sm">{expandedSection === section.id ? '▲' : '▼'}</span>
                            </div>
                        </div>

                        {/* Section Body */}
                        {expandedSection === section.id && (
                            <div className="p-4 space-y-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                                    <Input label="Section Title" id={`sec-title-${sIndex}`} value={section.title} onChange={e => handleSectionChange(sIndex, 'title', e.target.value)} />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Icon</label>
                                        <select 
                                            value={section.icon} 
                                            onChange={e => handleSectionChange(sIndex, 'icon', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#8C1E1E] focus:ring-[#8C1E1E] text-sm"
                                        >
                                            {availableIcons.map(icon => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Fields List */}
                                <div className="space-y-3">
                                    {section.fields.map((field, fIndex) => (
                                        <div key={fIndex} className="border border-gray-200 rounded-md p-3 relative bg-white">
                                            <button 
                                                type="button" 
                                                onClick={() => removeField(sIndex, fIndex)} 
                                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs font-bold"
                                            >
                                                Remove
                                            </button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                                                <Input label="Label" id={`lbl-${sIndex}-${fIndex}`} value={field.label} onChange={e => handleFieldChange(sIndex, fIndex, 'label', e.target.value)} />
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Database Mapping (ID)</label>
                                                    <select 
                                                        value={field.id} 
                                                        onChange={e => handleFieldChange(sIndex, fIndex, 'id', e.target.value)}
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#8C1E1E] focus:ring-[#8C1E1E] text-sm"
                                                    >
                                                        {availableDbColumns.map(col => (
                                                            <option key={col.id} value={col.id}>{col.label} ({col.id})</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
                                                    <select 
                                                        value={field.type} 
                                                        onChange={e => handleFieldChange(sIndex, fIndex, 'type', e.target.value)}
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#8C1E1E] focus:ring-[#8C1E1E] text-sm"
                                                    >
                                                        <option value="text">Text Input</option>
                                                        <option value="textarea">Text Area</option>
                                                        <option value="number">Number</option>
                                                        <option value="email">Email</option>
                                                        <option value="tel">Phone</option>
                                                        <option value="select">Dropdown Select</option>
                                                        <option value="checkbox-group">Checkbox Group</option>
                                                    </select>
                                                </div>

                                                <div className="flex gap-4 items-end pb-2">
                                                    <div className="flex items-center">
                                                        <input type="checkbox" checked={field.required} onChange={e => handleFieldChange(sIndex, fIndex, 'required', e.target.checked)} className="h-4 w-4 text-[#8C1E1E] focus:ring-[#8C1E1E] border-gray-300 rounded"/>
                                                        <label className="ml-2 text-sm text-gray-700">Required</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input type="checkbox" checked={field.width === 'full'} onChange={e => handleFieldChange(sIndex, fIndex, 'width', e.target.checked ? 'full' : 'half')} className="h-4 w-4 text-[#8C1E1E] focus:ring-[#8C1E1E] border-gray-300 rounded"/>
                                                        <label className="ml-2 text-sm text-gray-700">Full Width</label>
                                                    </div>
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                     <Input label="Placeholder" id={`ph-${sIndex}-${fIndex}`} value={field.placeholder || ''} onChange={e => handleFieldChange(sIndex, fIndex, 'placeholder', e.target.value)} />
                                                </div>

                                                {(field.type === 'select' || field.type === 'checkbox-group') && (
                                                    <div className="md:col-span-2">
                                                         <label className="block text-sm font-medium text-gray-700 mb-1">Options (One per line)</label>
                                                         <textarea
                                                            value={field.options?.join('\n') || ''}
                                                            onChange={e => handleFieldChange(sIndex, fIndex, 'options', e.target.value.split('\n'))}
                                                            rows={3}
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#8C1E1E] focus:ring-[#8C1E1E] text-sm"
                                                         />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addField(sIndex)} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:border-gray-400 hover:text-gray-600 text-sm font-semibold">+ Add Field</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addSection} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">+ Add Section</button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6 sticky bottom-4">
                <div className="flex items-center justify-between">
                    <button type="submit" disabled={isSaving} className="bg-[#8C1E1E] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#7a1a1a] transition-colors disabled:bg-gray-400">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {status && <p className="text-green-600 font-semibold text-sm">{status}</p>}
                </div>
            </div>
        </form>
    );
};

export default IntakeFormForm;
