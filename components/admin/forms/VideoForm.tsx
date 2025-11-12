
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { VideoContent } from '../../../types';

interface VideoFormProps {
    sectionId: string;
}

const VideoForm: React.FC<VideoFormProps> = ({ sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as VideoContent;
    
    const [formData, setFormData] = useState<VideoContent | undefined>(sectionData);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as VideoContent);
    }, [content, sectionId]);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (key: keyof typeof formData, value: string) => {
        setFormData(prev => prev ? { ...prev, [key]: value } : undefined);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateSectionContent(sectionId, formData);
            setStatus('Video section saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'video')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Video section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Video Section</h2>
            
            <FormCard title="Video Content" onReset={handleReset}>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
                <Input label="YouTube Video ID" id="videoId" value={formData.videoId} onChange={e => handleInputChange('videoId', e.target.value)} />
                <p className="text-xs text-gray-500">
                    This is the unique ID from a YouTube URL. For example, in `https://www.youtube.com/watch?v=g_tea8ZN-ZE`, the ID is `g_tea8ZN-ZE`.
                </p>
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

export default VideoForm;
