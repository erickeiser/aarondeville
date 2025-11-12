
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { HeroContent } from '../../../types';

interface HeroFormProps {
    openMediaLibrary: (onSelect: (url: string) => void) => void;
    sectionId: string;
}

const HeroForm: React.FC<HeroFormProps> = ({ openMediaLibrary, sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as HeroContent;
    
    const [formData, setFormData] = useState<HeroContent | undefined>(sectionData);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as HeroContent);
    }, [content, sectionId]);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => prev ? { ...prev, [key]: value } : undefined);
    };

    const handleStatChange = (index: number, key: 'value' | 'label', value: string) => {
        const newStats = [...(formData.stats || [])];
        newStats[index] = { ...newStats[index], [key]: value };
        setFormData(prev => prev ? {...prev, stats: newStats} : undefined);
    };
    
    const handleGenerateImage = () => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/800x1000?fitness,workout,athlete&t=${timestamp}`;
        handleInputChange('imageUrl', newUrl);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateSectionContent(sectionId, formData);
            setStatus('Hero section saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'hero')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Hero section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Hero Section</h2>
            
            <FormCard title="Main Content" onReset={handleReset}>
                <Input label="Headline 1" id="headline1" value={formData.headline1} onChange={e => handleInputChange('headline1', e.target.value)} />
                <Input label="Headline 2 (Colored)" id="headline2" value={formData.headline2} onChange={e => handleInputChange('headline2', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="CTA Button 1 Text" id="cta1" value={formData.ctaButton1} onChange={e => handleInputChange('ctaButton1', e.target.value)} />
                    <Input label="CTA Button 2 Text" id="cta2" value={formData.ctaButton2} onChange={e => handleInputChange('ctaButton2', e.target.value)} />
                </div>
                <ImageInput 
                    label="Background Media URL (Image or Video)"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={e => handleInputChange('imageUrl', e.target.value)}
                    onGenerate={handleGenerateImage}
                    onSelect={() => openMediaLibrary(url => handleInputChange('imageUrl', url))}
                />
            </FormCard>

            <FormCard title="Statistics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.stats.map((stat, index) => (
                        <div key={index} className="space-y-2 p-4 bg-gray-50 border rounded-md">
                             <p className="text-sm font-semibold text-gray-600">Stat {index + 1}</p>
                            <Input label="Value" id={`stat-val-${index}`} value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} />
                            <Input label="Label" id={`stat-label-${index}`} value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} />
                        </div>
                    ))}
                </div>
            </FormCard>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">Save Changes</button>
                    {status && <p className="text-green-600 font-semibold text-sm">{status}</p>}
                </div>
            </div>
        </form>
    );
};

export default HeroForm;
