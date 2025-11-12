
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

const FooterForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.footer);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.footer);
    }, [content.footer]);

    const handleInputChange = (section: keyof typeof formData, key: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, footer: formData });
        setStatus('Footer section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the Footer section to its default content? This will update the database.")) {
            setContent({ ...content, footer: defaultContent.footer });
            setStatus('Footer section has been reset to default.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-800">Edit Footer Section</h2>
            
            <FormCard title="General Footer Content" onReset={handleReset}>
                <Textarea label="Footer Tagline" id="tagline" value={formData.tagline} onChange={e => setFormData(p => ({...p, tagline: e.target.value}))} />
                <Input label="Copyright Text" id="copyright" value={formData.copyright} onChange={e => setFormData(p => ({...p, copyright: e.target.value}))} />
            </FormCard>
            
            <FormCard title="Quick Links Column">
                <Input label="Column Title" id="qlTitle" value={formData.quickLinks.title} onChange={e => handleInputChange('quickLinks', 'title', e.target.value)} />
                <Input label="'Get Started' Link Text" id="qlGetStarted" value={formData.quickLinks.getStarted} onChange={e => handleInputChange('quickLinks', 'getStarted', e.target.value)} />
                <Input label="'Admin Panel' Link Text" id="qlAdmin" value={formData.quickLinks.admin} onChange={e => handleInputChange('quickLinks', 'admin', e.target.value)} />
            </FormCard>
            
            <FormCard title="Services Column">
                <Input label="Column Title" id="svcsTitle" value={formData.services.title} onChange={e => handleInputChange('services', 'title', e.target.value)} />
                <Textarea label="Services List (one per line)" id="svcsList" value={formData.services.list.join('\n')} onChange={e => handleInputChange('services', 'list', e.target.value.split('\n'))} />
            </FormCard>

            <FormCard title="Contact Info Column">
                <Input label="Column Title" id="contactTitle" value={formData.contact.title} onChange={e => handleInputChange('contact', 'title', e.target.value)} />
                <Input label="'Hours' Title" id="contactHours" value={formData.contact.hoursTitle} onChange={e => handleInputChange('contact', 'hoursTitle', e.target.value)} />
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

export default FooterForm;
