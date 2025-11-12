import React, { useState, FormEvent } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput } from './FormElements';

const HeroForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.hero);
    const [status, setStatus] = useState('');

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleStatChange = (index: number, key: 'value' | 'label', value: string) => {
        const newStats = [...formData.stats];
        newStats[index] = { ...newStats[index], [key]: value };
        setFormData(prev => ({...prev, stats: newStats}));
    };
    
    const handleGenerateImage = () => {
        const timestamp = new Date().getTime(); // To avoid cached images
        const newUrl = `https://source.unsplash.com/random/800x1000?fitness,workout,athlete&t=${timestamp}`;
        handleInputChange('imageUrl', newUrl);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, hero: formData });
        setStatus('Hero section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Hero Section</h2>
                <div className="space-y-4">
                    <Input label="Headline 1" id="headline1" value={formData.headline1} onChange={e => handleInputChange('headline1', e.target.value)} />
                    <Input label="Headline 2 (Colored)" id="headline2" value={formData.headline2} onChange={e => handleInputChange('headline2', e.target.value)} />
                    <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
                    <Input label="CTA Button 1 Text" id="cta1" value={formData.ctaButton1} onChange={e => handleInputChange('ctaButton1', e.target.value)} />
                    <Input label="CTA Button 2 Text" id="cta2" value={formData.ctaButton2} onChange={e => handleInputChange('ctaButton2', e.target.value)} />
                    <ImageInput 
                        label="Image URL"
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={e => handleInputChange('imageUrl', e.target.value)}
                        onGenerate={handleGenerateImage}
                    />

                    <h3 className="text-lg font-semibold text-gray-700 pt-4">Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.stats.map((stat, index) => (
                            <div key={index} className="space-y-2 p-4 border rounded-md">
                                <Input label={`Stat ${index + 1} Value`} id={`stat-val-${index}`} value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} />
                                <Input label={`Stat ${index + 1} Label`} id={`stat-label-${index}`} value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} />
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

export default HeroForm;