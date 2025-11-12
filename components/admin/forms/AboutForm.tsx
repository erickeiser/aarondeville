import React, { useState, FormEvent } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput } from './FormElements';

const AboutForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.about);
    const [status, setStatus] = useState('');

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleCertificationChange = (index: number, key: 'title' | 'issuer', value: string) => {
        const newCerts = [...formData.certifications];
        newCerts[index] = { ...newCerts[index], [key]: value };
        setFormData(prev => ({...prev, certifications: newCerts}));
    };
    
    const handleValueChange = (index: number, key: 'title' | 'description', value: string) => {
        const newValues = [...formData.values];
        newValues[index] = { ...newValues[index], [key]: value };
        setFormData(prev => ({...prev, values: newValues}));
    };
    
    const handleGenerateImage = () => {
        const timestamp = new Date().getTime(); // To avoid cached images
        const newUrl = `https://source.unsplash.com/random/800x600?gym,barbell,weights&t=${timestamp}`;
        handleInputChange('imageUrl', newUrl);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, about: formData });
        setStatus('About section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit About Section</h2>
                <div className="space-y-4">
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
                    />

                    <h3 className="text-lg font-semibold text-gray-700 pt-4">Certifications</h3>
                    <div className="space-y-4">
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="p-4 border rounded-md grid grid-cols-2 gap-4">
                                <Input label={`Cert ${index + 1} Title`} id={`cert-title-${index}`} value={cert.title} onChange={e => handleCertificationChange(index, 'title', e.target.value)} />
                                <Input label={`Cert ${index + 1} Issuer`} id={`cert-issuer-${index}`} value={cert.issuer} onChange={e => handleCertificationChange(index, 'issuer', e.target.value)} />
                            </div>
                        ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-700 pt-4">Core Values</h3>
                     <div className="space-y-4">
                        {formData.values.map((val, index) => (
                            <div key={index} className="p-4 border rounded-md grid grid-cols-1 gap-4">
                               <p className="text-sm text-gray-600">Value {index+1} (Icon is set automatically)</p>
                                <Input label={`Value Title`} id={`val-title-${index}`} value={val.title} onChange={e => handleValueChange(index, 'title', e.target.value)} />
                                <Textarea label={`Value Description`} id={`val-desc-${index}`} value={val.description} onChange={e => handleValueChange(index, 'description', e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">Save Changes</button>
                {status && <p className="text-green-600 font-semibold">{status}</p>}
            </div>
        </form>
    );
};

export default AboutForm;