
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { WriteSuccessStoryContent } from '../../../types';

interface WriteSuccessStoryFormProps {
    openMediaLibrary: (onSelect: (url: string) => void) => void;
    sectionId: string;
}

const WriteSuccessStoryForm: React.FC<WriteSuccessStoryFormProps> = ({ openMediaLibrary, sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as WriteSuccessStoryContent;
    
    const [formData, setFormData] = useState<WriteSuccessStoryContent | undefined>(sectionData);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as WriteSuccessStoryContent);
    }, [content, sectionId]);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (key: keyof typeof formData, value: any) => {
        setFormData(prev => prev ? { ...prev, [key]: value } : undefined);
    };

    const handleGenerateImage = () => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/800x1000?success,motivation,gym&t=${timestamp}`;
        handleInputChange('imageUrl', newUrl);
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
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'writeSuccessStory')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Write Success Story Section</h2>
            
            <FormCard title="Main Content" onReset={handleReset}>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Paragraph" id="paragraph" value={formData.paragraph} onChange={e => handleInputChange('paragraph', e.target.value)} rows={4} />
                <Textarea 
                    label="Bullet Points (one per line)" 
                    id="points" 
                    value={formData.points.join('\n')} 
                    onChange={e => handleInputChange('points', e.target.value.split('\n'))} 
                    rows={4} 
                />
                <Input label="Button Text" id="buttonText" value={formData.buttonText} onChange={e => handleInputChange('buttonText', e.target.value)} />
                <ImageInput 
                    label="Image URL"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={e => handleInputChange('imageUrl', e.target.value)}
                    onGenerate={handleGenerateImage}
                    onSelect={() => openMediaLibrary(url => handleInputChange('imageUrl', url))}
                />
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

export default WriteSuccessStoryForm;
