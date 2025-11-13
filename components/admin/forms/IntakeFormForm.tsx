
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { IntakeFormContent } from '../../../types';

interface IntakeFormFormProps {
    sectionId: string;
}

const IntakeFormForm: React.FC<IntakeFormFormProps> = ({ sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as IntakeFormContent;
    
    const [formData, setFormData] = useState<IntakeFormContent | undefined>(sectionData);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as IntakeFormContent);
    }, [content, sectionId]);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => prev ? { ...prev, [key]: value } : undefined);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            setIsSaving(true);
            setStatus('Saving...');
            const success = await updateSectionContent(sectionId, formData);
            setIsSaving(false);
            if (success) {
                setStatus('Section saved successfully!');
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
            <h2 className="text-2xl font-bold text-gray-800">Edit Intake Form Section</h2>
            
            <FormCard title="Main Content" onReset={handleReset}>
                <p className="text-sm text-gray-600 mb-4">This section edits the title and subtitle that appear above the form. The form fields themselves are fixed and cannot be changed from this panel.</p>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
            </FormCard>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
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
