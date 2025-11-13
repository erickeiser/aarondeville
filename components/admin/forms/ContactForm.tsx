


import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { ContactContent } from '../../../types';

interface ContactFormProps {
    sectionId: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as ContactContent;
    
    const [formData, setFormData] = useState<ContactContent | undefined>(sectionData);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as ContactContent);
    }, [content, sectionId]);
    
    if (!formData) return <div>Loading...</div>;

    const handleInputChange = (section: keyof typeof formData, key: any, value: any, subKey?: any) => {
        setFormData(prev => {
            if (!prev) return undefined;
            const sectionData = prev[section];
            if (typeof sectionData !== 'object' || sectionData === null) {
                return prev;
            }

            const newSection = { ...sectionData };
            if(subKey) {
                // @ts-ignore
                newSection[key] = { ...newSection[key], [subKey]: value };
            } else {
                // @ts-ignore
                newSection[key] = value;
            }
            return { ...prev, [section]: newSection };
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            setIsSaving(true);
            setStatus('Saving...');
            const success = await updateSectionContent(sectionId, formData);
            setIsSaving(false);
            if (success) {
                setStatus('Contact section saved successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('Save failed. Content was updated elsewhere.');
            }
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'contact')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Contact section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Contact Section</h2>

            <FormCard title="Main Titles & Subheadings" onReset={handleReset}>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => setFormData(p => p ? ({...p, headline: e.target.value}) : undefined)} />
                <Input label="Subheading Line 1" id="sub1" value={formData.subheading.line1} onChange={e => handleInputChange('subheading', 'line1', e.target.value)} />
                <Input label="Subheading Line 2" id="sub2" value={formData.subheading.line2} onChange={e => handleInputChange('subheading', 'line2', e.target.value)} />
            </FormCard>

            <FormCard title="`Let's Connect` Info">
                <Input label="Title" id="connectTitle" value={formData.connect.title} onChange={e => handleInputChange('connect', 'title', e.target.value)} />
                <Textarea label="Paragraph" id="connectPara" value={formData.connect.paragraph} onChange={e => handleInputChange('connect', 'paragraph', e.target.value)} />
            </FormCard>
            
            <FormCard title="Contact Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Email Address" id="email" value={formData.details.email.address} onChange={e => handleInputChange('details', 'email', e.target.value, 'address')} />
                    <Input label="Email Note" id="emailNote" value={formData.details.email.note} onChange={e => handleInputChange('details', 'email', e.target.value, 'note')} />
                    <Input label="Phone Number" id="phone" value={formData.details.phone.number} onChange={e => handleInputChange('details', 'phone', e.target.value, 'number')} />
                    <Input label="Phone Note" id="phoneNote" value={formData.details.phone.note} onChange={e => handleInputChange('details', 'phone', e.target.value, 'note')} />
                    <Input label="Location Name" id="locName" value={formData.details.location.name} onChange={e => handleInputChange('details', 'location', e.target.value, 'name')} />
                    <Input label="Location Address" id="locAddr" value={formData.details.location.address} onChange={e => handleInputChange('details', 'location', e.target.value, 'address')} />
                </div>
                 <Input label="Location Note" id="locNote" value={formData.details.location.note} onChange={e => handleInputChange('details', 'location', e.target.value, 'note')} />
                <Textarea label="Availability (one per line)" id="availability" value={formData.details.availability.join('\n')} onChange={e => handleInputChange('details', 'availability', e.target.value.split('\n'))} />
            </FormCard>
            
            <FormCard title="Quick Guarantee Box">
                <Input label="Title" id="guaranteeTitle" value={formData.guarantee.title} onChange={e => handleInputChange('guarantee', 'title', e.target.value)} />
                <Textarea label="Text" id="guaranteeText" value={formData.guarantee.text} onChange={e => handleInputChange('guarantee', 'text', e.target.value)} />
            </FormCard>

            <FormCard title="Contact Form Labels & Placeholders">
                <Input label="Form Title" id="formTitle" value={formData.form.title} onChange={e => handleInputChange('form', 'title', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name Label" id="formName" value={formData.form.nameLabel} onChange={e => handleInputChange('form', 'nameLabel', e.target.value)} />
                    <Input label="Email Label" id="formEmail" value={formData.form.emailLabel} onChange={e => handleInputChange('form', 'emailLabel', e.target.value)} />
                    <Input label="Subject Label" id="formSubject" value={formData.form.subjectLabel} onChange={e => handleInputChange('form', 'subjectLabel', e.target.value)} />
                    <Input label="Subject Placeholder" id="formSubjectPlaceholder" value={formData.form.subjectPlaceholder} onChange={e => handleInputChange('form', 'subjectPlaceholder', e.target.value)} />
                    <Input label="Message Label" id="formMessage" value={formData.form.messageLabel} onChange={e => handleInputChange('form', 'messageLabel', e.target.value)} />
                    <Input label="Message Placeholder" id="formMessagePlaceholder" value={formData.form.messagePlaceholder} onChange={e => handleInputChange('form', 'messagePlaceholder', e.target.value)} />
                </div>
                <Input label="Button Text" id="formButton" value={formData.form.buttonText} onChange={e => handleInputChange('form', 'buttonText', e.target.value)} />
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

export default ContactForm;