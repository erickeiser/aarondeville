
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FileObject } from '@supabase/storage-js';
import { UploadIcon, TrashIcon, ClipboardCopyIcon, EyeIcon } from '../Icons';

const BUCKET_NAME = 'media';

interface MediaLibraryProps {
    isModal: boolean;
    onSelect?: (url: string) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ isModal, onSelect }) => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) {
            console.error('Error fetching files:', error);
            setError(`Failed to load media. Please ensure you have created a public bucket named "${BUCKET_NAME}" with the correct policies.`);
        } else {
            setFiles(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileUpload = async (selectedFiles: FileList | null) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        setError(null);

        for (const file of Array.from(selectedFiles)) {
             const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
             const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, file);
            
            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                setError(`Upload failed: ${uploadError.message}`);
            }
        }
        
        setUploading(false);
        fetchFiles(); // Refresh the list
    };

    const handleDelete = async (fileName: string) => {
        if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
            const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName]);
            
            if (deleteError) {
                console.error('Error deleting file:', deleteError);
                setError(`Failed to delete file: ${deleteError.message}`);
            } else {
                fetchFiles();
            }
        }
    };
    
    const getPublicUrl = (fileName: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        return data.publicUrl;
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };
    
    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };


    return (
        <div className={`bg-white rounded-lg ${!isModal ? 'p-6 shadow-sm border' : ''}`}>
            {!isModal && (
                <div className="pb-4 border-b mb-4">
                     <h2 className="text-2xl font-bold text-gray-800">Media Library</h2>
                     <p className="text-sm text-gray-500 mt-1">Upload and manage images for your website.</p>
                </div>
            )}
           
            <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <UploadIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 font-semibold text-gray-700">Drag & drop files here</p>
                <p className="text-sm text-gray-500">or</p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    id="file-upload"
                    className="hidden"
                    disabled={uploading}
                />
                <label htmlFor="file-upload" className={`mt-2 inline-block px-4 py-2 text-sm font-semibold rounded-md transition-colors ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'}`}>
                    {uploading ? 'Uploading...' : 'Select Files'}
                </label>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map(file => {
                            const publicUrl = getPublicUrl(file.name);
                            return (
                                <div key={file.id} className="group relative border rounded-lg overflow-hidden aspect-square">
                                    <img src={publicUrl} alt={file.name} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                                        <p className="text-white text-xs break-words">{file.name}</p>
                                        <div className="flex flex-col gap-1">
                                            {isModal && onSelect && (
                                                <button onClick={() => onSelect(publicUrl)} className="w-full bg-red-600 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-700">
                                                    Select
                                                </button>
                                            )}
                                            <div className="flex justify-center gap-1">
                                                 <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-1.5 rounded hover:bg-white text-gray-700" title="View">
                                                    <EyeIcon className="h-4 w-4"/>
                                                </a>
                                                <button onClick={() => copyToClipboard(publicUrl)} className="bg-gray-200 p-1.5 rounded hover:bg-white text-gray-700" title="Copy URL">
                                                    <ClipboardCopyIcon className="h-4 w-4"/>
                                                </button>
                                                <button onClick={() => handleDelete(file.name)} className="bg-red-200 text-red-700 p-1.5 rounded hover:bg-red-300" title="Delete">
                                                    <TrashIcon className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                { !loading && files.length === 0 && <p className="text-gray-500 text-sm">No files uploaded yet.</p>}
            </div>
        </div>
    );
};

export default MediaLibrary;
