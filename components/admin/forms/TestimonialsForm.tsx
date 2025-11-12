import React, { useState, FormEvent } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput } from './FormElements';

type Story = {
    name: string;
    achievement: string;
    quote: string;
    imageUrl: string;
    avatarUrl: string;
    tag: string;
}

const TestimonialsForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.testimonials);
    const [status, setStatus] = useState('');

    const handleInputChange = (key: 'headline' | 'subheading', value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    
    const handleStoryChange = (index: number, key: keyof Story, value: string) => {
        const newStories = [...formData.stories];
        newStories[index] = { ...newStories[index], [key]: value };
        setFormData(prev => ({...prev, stories: newStories}));
    };

    const addStory = () => {
        const newStory = { name: 'New Client', achievement: '', quote: '', imageUrl: '', avatarUrl: '', tag: '' };
        setFormData(prev => ({...prev, stories: [...prev.stories, newStory]}));
    };

    const removeStory = (index: number) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            const newStories = formData.stories.filter((_, i) => i !== index);
            setFormData(prev => ({...prev, stories: newStories}));
        }
    };

    const handleGenerateStoryImage = (index: number) => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/800x600?fitness,person,workout&t=${timestamp}`;
        handleStoryChange(index, 'imageUrl', newUrl);
    };

    const handleGenerateAvatarImage = (index: number) => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/200x200?portrait,person,face&t=${timestamp}`;
        handleStoryChange(index, 'avatarUrl', newUrl);
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, testimonials: formData });
        setStatus('Testimonials section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Testimonials Section</h2>
                <div className="space-y-4 mb-8">
                    <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                    <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Client Stories</h3>
                <div className="space-y-6">
                    {formData.stories.map((story, index) => (
                        <div key={index} className="p-6 border rounded-lg space-y-4 relative">
                            <h4 className="font-semibold text-lg text-gray-700">Testimonial {index + 1}</h4>
                            <button type="button" onClick={() => removeStory(index)} className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold">X</button>
                            
                            <Input label="Name" id={`name-${index}`} value={story.name} onChange={e => handleStoryChange(index, 'name', e.target.value)} />
                            <Input label="Achievement" id={`achievement-${index}`} value={story.achievement} onChange={e => handleStoryChange(index, 'achievement', e.target.value)} />
                            <Textarea label="Quote" id={`quote-${index}`} value={story.quote} onChange={e => handleStoryChange(index, 'quote', e.target.value)} />
                            <Input label="Tag (e.g. -30 lbs)" id={`tag-${index}`} value={story.tag} onChange={e => handleStoryChange(index, 'tag', e.target.value)} />
                            <ImageInput 
                                label="Image URL" 
                                id={`imageUrl-${index}`} 
                                value={story.imageUrl} 
                                onChange={e => handleStoryChange(index, 'imageUrl', e.target.value)}
                                onGenerate={() => handleGenerateStoryImage(index)}
                            />
                            <ImageInput 
                                label="Avatar URL" 
                                id={`avatarUrl-${index}`} 
                                value={story.avatarUrl} 
                                onChange={e => handleStoryChange(index, 'avatarUrl', e.target.value)}
                                onGenerate={() => handleGenerateAvatarImage(index)}
                            />
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addStory} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">+ Add New Testimonial</button>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">Save Changes</button>
                {status && <p className="text-green-600 font-semibold">{status}</p>}
            </div>
        </form>
    );
};

export default TestimonialsForm;