

import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { AboutContent } from '../../../types';

interface AboutFormProps {
    openMediaLibrary: (onSelect: (url: string) => void) => void;
    sectionId: string;
}

const AboutForm: React.FC<AboutFormProps> = ({ openMediaLibrary, sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as AboutContent;
    
    const [formData, setFormData] = useState<AboutContent | undefined>(sectionData);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as AboutContent);
    }, [content, sectionId]);

    if (!formData) return <div>Loading...</div>;

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => prev ? ({ ...prev, [key]: value }) : undefined);
    };

    const handleCertificationChange = (index: number, key: 'title' | 'issuer', value: string) => {
        const newCerts = [...formData.certifications];
        newCerts[index] = { ...newCerts[index], [key]: value };
        setFormData(prev => prev ? ({...prev, certifications: newCerts}) : undefined);
    };
    
    const handleValueChange = (index: number, key: 'title' | 'description', value: string) => {
        const newValues = [...formData.values];
        newValues[index] = { ...newValues[index], [key]: value };
        setFormData(prev => prev ? ({...prev, values: newValues}) : undefined);
    };
    
    const handleGenerateImage = () => {
        const timestamp = new Date().getTime(); // To avoid cached images
        const newUrl = `https://source.unsplash.com/random/800x600?gym,barbell,weights&t=${timestamp}`;
        handleInputChange('imageUrl', newUrl);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateSectionContent(sectionId, formData);
            setStatus('About section saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        }
    };
    
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'about')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('About section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit About Section</h2>

            <FormCard title="Main Content" onReset={handleReset}>
                <Input label="Headline 1" id="headline1" value={formData.headline1} onChange={e => handleInputChange('headline1', e.target.value)} />
                <Input label="Headline 2 (Colored)" id="headline2" value={formData.headline2} onChange={e => handleInputChange('headline2', e.target.value)} />
                <Textarea label="Paragraph 1" id="p1" value={formData.paragraph1} onChange={e => handleInputChange('paragraph1', e.target.value)} rows={5} />
                <Textarea label="Paragraph 2" id="p2" value={formData.paragraph2} onChange={e => handleInputChange('paragraph2', e.target.value)} rows={5} />
                <ImageInput
                    label="Image URL"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={e => handleInputChange('imageUrl', e.target.value)}
                    onGenerate={handleGenerateImage}
                    onSelect={() => openMediaLibrary(url => handleInputChange('imageUrl', url))}
                />
            </FormCard>

            <FormCard title="Certifications">
                 <Input label="Certifications Section Title" id="certTitle" value={formData.certificationsTitle} onChange={e => handleInputChange('certificationsTitle', e.target.value)} />
                <div className="space-y-4">
                    {formData.certifications.map((cert, index) => (
                        <div key={index} className="p-4 bg-gray-50 border rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-sm font-semibold text-gray-600 sm:col-span-2">Certification {index + 1}</p>
                            <Input label="Title" id={`cert-title-${index}`} value={cert.title} onChange={e => handleCertificationChange(index, 'title', e.target.value)} />
                            <Input label="Issuer" id={`cert-issuer-${index}`} value={cert.issuer} onChange={e => handleCertificationChange(index, 'issuer', e.target.value)} />
                        </div>
                    ))}
                </div>
            </FormCard>
            
            <FormCard title="Core Values">
                <div className="space-y-4">
                    {formData.values.map((val, index) => (
                        <div key={index} className="p-4 bg-gray-50 border rounded-md space-y-4">
                            <p className="text-sm font-semibold text-gray-600">Value {index+1} (Icon is set automatically)</p>
                            <Input label="Title" id={`val-title-${index}`} value={val.title} onChange={e => handleValueChange(index, 'title', e.target.value)} />
                            <Textarea label="Description" id={`val-desc-${index}`} value={val.description} onChange={e => handleValueChange(index, 'description', e.target.value)} />
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

export default AboutForm;
