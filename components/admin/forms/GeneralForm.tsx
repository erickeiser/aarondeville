
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { SiteContent } from '../../../types';
import { Input, Textarea, ImageInput, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

interface GeneralFormProps {
    openMediaLibrary: (onSelect: (url: string) => void) => void;
}

const GeneralForm: React.FC<GeneralFormProps> = ({ openMediaLibrary }) => {
    const { content, setContent, resetContent } = useContent();
    const [formData, setFormData] = useState(content);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content);
    }, [content]);

    const handleInputChange = (section: keyof SiteContent, key: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [key]: value
            }
        }));
    };
    
    const handleNavLinksChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            header: {
                ...prev.header,
                navLinks: {
                    ...prev.header.navLinks,
                    [key]: value
                }
            }
        }));
    };

    const handleGenerateStoryImage = () => {
        const timestamp = new Date().getTime(); // To avoid cached images
        const newUrl = `https://source.unsplash.com/random/800x600?gym,punching-bag,motivation&t=${timestamp}`;
        handleInputChange('writeSuccessStory', 'imageUrl', newUrl);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent(formData);
        setStatus('Content saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };
    
    const handleResetAll = () => {
        resetContent();
        setStatus('All website content has been reset to default.');
        setTimeout(() => setStatus(''), 3000);
    }
    
    const handleResetSection = (sectionKey: keyof SiteContent, sectionName: string) => {
        if (window.confirm(`Are you sure you want to reset the ${sectionName} section to its default content? This will update the database.`)) {
            setContent({ ...content, [sectionKey]: defaultContent[sectionKey] });
            setStatus(`${sectionName} section has been reset to default.`);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
            
            <FormCard title="Header Settings" onReset={() => handleResetSection('header', 'Header')}>
                <Input label="Site Name" id="siteName" value={formData.header.siteName} onChange={e => handleInputChange('header', 'siteName', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nav Link: Home" id="navHome" value={formData.header.navLinks.home} onChange={e => handleNavLinksChange('home', e.target.value)} />
                    <Input label="Nav Link: About" id="navAbout" value={formData.header.navLinks.about} onChange={e => handleNavLinksChange('about', e.target.value)} />
                    <Input label="Nav Link: Services" id="navServices" value={formData.header.navLinks.services} onChange={e => handleNavLinksChange('services', e.target.value)} />
                    <Input label="Nav Link: Success Stories" id="navSuccess" value={formData.header.navLinks.successStories} onChange={e => handleNavLinksChange('successStories', e.target.value)} />
                    <Input label="Nav Link: Contact" id="navContact" value={formData.header.navLinks.contact} onChange={e => handleNavLinksChange('contact', e.target.value)} />
                </div>
                <Input label="Header CTA Button Text" id="headerCta" value={formData.header.ctaButton} onChange={e => handleInputChange('header', 'ctaButton', e.target.value)} />
            </FormCard>

            <FormCard title="Consultation Section" onReset={() => handleResetSection('consultation', 'Consultation')}>
                <Input label="Headline" id="consultHeadline" value={formData.consultation.headline} onChange={e => handleInputChange('consultation', 'headline', e.target.value)} />
                <Textarea label="Subheading" id="consultSubheading" value={formData.consultation.subheading} onChange={e => handleInputChange('consultation', 'subheading', e.target.value)} />
                <Input label="Button Text" id="consultButton" value={formData.consultation.buttonText} onChange={e => handleInputChange('consultation', 'buttonText', e.target.value)} />
            </FormCard>
            
            <FormCard title="Write Success Story Section" onReset={() => handleResetSection('writeSuccessStory', 'Success Story')}>
                <Input label="Headline" id="storyHeadline" value={formData.writeSuccessStory.headline} onChange={e => handleInputChange('writeSuccessStory', 'headline', e.target.value)} />
                <Textarea label="Paragraph" id="storyParagraph" value={formData.writeSuccessStory.paragraph} onChange={e => handleInputChange('writeSuccessStory', 'paragraph', e.target.value)} />
                <Textarea label="Bullet Points (one per line)" id="storyPoints" value={formData.writeSuccessStory.points.join('\n')} onChange={e => handleInputChange('writeSuccessStory', 'points', e.target.value.split('\n'))} />
                <Input label="Button Text" id="storyButton" value={formData.writeSuccessStory.buttonText} onChange={e => handleInputChange('writeSuccessStory', 'buttonText', e.target.value)} />
                <ImageInput 
                  label="Image URL" 
                  id="storyImage" 
                  value={formData.writeSuccessStory.imageUrl} 
                  onChange={e => handleInputChange('writeSuccessStory', 'imageUrl', e.target.value)}
                  onGenerate={handleGenerateStoryImage}
                  onSelect={() => openMediaLibrary(url => handleInputChange('writeSuccessStory', 'imageUrl', url))}
                />
            </FormCard>

            <FormCard title="Intake Form Section" onReset={() => handleResetSection('intakeForm', 'Intake Form')}>
                <Input label="Headline" id="formHeadline" value={formData.intakeForm.headline} onChange={e => handleInputChange('intakeForm', 'headline', e.target.value)} />
                <Textarea label="Subheading" id="formSubheading" value={formData.intakeForm.subheading} onChange={e => handleInputChange('intakeForm', 'subheading', e.target.value)} />
            </FormCard>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors w-full sm:w-auto mb-2 sm:mb-0">Save All Changes</button>
                    {status && <p className="text-green-600 font-semibold text-sm">{status}</p>}
                    <button type="button" onClick={handleResetAll} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm w-full sm:w-auto">Reset All Website Content</button>
                </div>
            </div>
        </form>
    );
};

export default GeneralForm;
