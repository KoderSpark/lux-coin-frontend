import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../api';
import { FiX, FiPlus, FiUploadCloud, FiStar, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';

const ListingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        category: 'Islands',
        description: '',
        price: '',
        priceOnApplication: false,
        status: 'draft',
        isFeatured: false,
        images: [],
        specifications: {}
    });

    const [specsList, setSpecsList] = useState([]); // Array of { key: '', value: '' }
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isEditMode) {
            fetchListing();
        }
    }, [id]);

    const fetchListing = async () => {
        try {
            const { data } = await api.get(`/listings/admin/all`);
            const listing = data.find(l => l._id === id); // since there is no single admin fetch route, we filter from all
            if (listing) {
                setFormData({
                    ...listing,
                    price: listing.price || '',
                    images: listing.images || []
                });

                // Transform spec Map to array for editing
                if (listing.specifications) {
                    setSpecsList(Object.entries(listing.specifications).map(([key, value]) => ({ key, value })));
                }
            }
        } catch (err) {
            setError('Failed to fetch listing data');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleDescriptionChange = (content) => {
        setFormData({ ...formData, description: content });
    };

    // Specs handling
    const addSpecRow = () => {
        setSpecsList([...specsList, { key: '', value: '' }]);
    };

    const updateSpec = (index, field, value) => {
        const newList = [...specsList];
        newList[index][field] = value;
        setSpecsList(newList);
    };

    const removeSpec = (index) => {
        setSpecsList(specsList.filter((_, i) => i !== index));
    };

    // Image handling
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return {
                    url: data.url,
                    publicId: data.publicId,
                    order: 0, // will reindex dynamically later
                    isPrimary: false
                };
            });

            const newImages = await Promise.all(uploadPromises);

            setFormData(prev => {
                const combined = [...prev.images, ...newImages];
                if (combined.length > 0 && !combined.find(img => img.isPrimary)) {
                    combined[0].isPrimary = true;
                }
                return { ...prev, images: combined };
            });
        } catch (err) {
            setError('Failed to upload image(s)');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const deleteImage = async (index, publicId) => {
        try {
            if (publicId) {
                await api.delete('/upload', { data: { publicId } });
            }
            const newImages = formData.images.filter((_, i) => i !== index);
            // Ensure primary exists
            if (newImages.length > 0 && !newImages.find(img => img.isPrimary)) {
                newImages[0].isPrimary = true;
            }
            setFormData({ ...formData, images: newImages });
        } catch (err) {
            console.error('Failed to delete image', err);
        }
    };

    const setPrimaryImage = (index) => {
        const newImages = formData.images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e, forceStatus = null) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Transform specs back to object
        const specsObject = {};
        specsList.forEach(spec => {
            if (spec.key.trim() && spec.value.trim()) {
                specsObject[spec.key.trim()] = spec.value.trim();
            }
        });

        const finalData = {
            ...formData,
            specifications: specsObject,
            price: formData.priceOnApplication ? null : Number(formData.price),
        };

        if (forceStatus) {
            finalData.status = forceStatus;
        }

        // Assign final ordering to images
        finalData.images = finalData.images.map((img, idx) => ({ ...img, order: idx }));

        try {
            if (isEditMode) {
                await api.put(`/listings/admin/${id}`, finalData);
            } else {
                await api.post('/listings/admin', finalData);
            }
            navigate('/admin/listings');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save listing');
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ]
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center border-b border-[#333] pb-6">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-1">
                        {isEditMode ? 'Edit Asset' : 'New Asset'}
                    </h1>
                    <p className="text-gray-400">Provide comprehensive details for the luxury listing.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                    >
                        <FiSave /> Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'active')}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] text-[#0D0D0D] rounded hover:bg-[#FFD700] transition-colors font-medium"
                    >
                        <FiCheckCircle /> Publish Asset
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded text-sm">
                    {error}
                </div>
            )}

            <form className="space-y-8" id="listingForm">
                {/* Core Info */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl space-y-6 shadow-lg">
                    <h2 className="text-lg text-white font-medium border-b border-[#333] pb-2 mb-4">Core Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="lux-label">Asset Title *</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="lux-input text-lg font-medium" />
                        </div>

                        <div>
                            <label className="lux-label">Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="lux-input bg-[#0D0D0D]">
                                <option value="Islands">Private Islands</option>
                                <option value="Luxury Cars">Automobiles & Hypercars</option>
                                <option value="Chartered Flights">Aviation</option>
                                <option value="Helicopters">Helicopters</option>
                                <option value="Luxury Watches">Haute Horlogerie</option>
                            </select>
                        </div>

                        <div>
                            <label className="lux-label">Current Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="lux-input bg-[#0D0D0D]">
                                <option value="draft">Draft (Hidden)</option>
                                <option value="active">Active (Visible)</option>
                                <option value="sold">Sold (Archive)</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        <div>
                            <label className="lux-label">Price (USD)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={formData.priceOnApplication}
                                className="lux-input disabled:opacity-50 disabled:bg-[#111]"
                                placeholder="2500000"
                            />
                        </div>

                        <div className="flex space-x-8 items-center pt-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="priceOnApplication"
                                    checked={formData.priceOnApplication}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-[#C9A84C] bg-[#0D0D0D] border-[#444]"
                                />
                                <span className="text-gray-300">Price on Application (POA)</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer border px-4 py-2 rounded border-[#333] hover:border-[#C9A84C] transition-colors">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-[#C9A84C] bg-[#0D0D0D] border-[#444]"
                                />
                                <span className="text-[#C9A84C] font-medium flex items-center gap-1">
                                    <FiStar /> Featured Asset
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Media Gallery */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl space-y-6 shadow-lg">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2 mb-4">
                        <h2 className="text-lg text-white font-medium">Media Gallery</h2>
                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#222] border border-[#444] text-white hover:border-[#C9A84C] transition-all rounded text-sm"
                            >
                                {uploading ? (
                                    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                                ) : (
                                    <><FiUploadCloud /> Upload Images</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${img.isPrimary ? 'border-[#C9A84C]' : 'border-[#333]'}`}>
                                <img src={img.url} className="w-full h-full object-cover" alt="Upload" />

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    {!img.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() => setPrimaryImage(idx)}
                                            className="px-3 py-1 bg-[#111] text-[#C9A84C] border border-[#C9A84C] text-xs rounded hover:bg-[#C9A84C] hover:text-[#0D0D0D]"
                                        >
                                            Make Primary
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => deleteImage(idx, img.publicId)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>

                                {img.isPrimary && (
                                    <div className="absolute top-2 left-2 bg-[#C9A84C] text-[#0D0D0D] text-xs px-2 py-1 font-bold rounded shadow">
                                        PRIMARY
                                    </div>
                                )}
                            </div>
                        ))}
                        {formData.images.length === 0 && !uploading && (
                            <div className="col-span-full py-12 border-2 border-dashed border-[#333] rounded-lg text-center flex flex-col items-center justify-center text-gray-500">
                                <FiUploadCloud size={32} className="mb-2" />
                                <p>No images uploaded yet.</p>
                                <p className="text-xs mt-1">First image will automatically be set as primary.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Rich Text */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl space-y-4 shadow-lg">
                    <h2 className="text-lg text-white font-medium border-b border-[#333] pb-2">Description Overview</h2>
                    <div className="text-white">
                        <ReactQuill
                            theme="snow"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            modules={modules}
                        />
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-[#1A1A1A] border border-[#333] p-6 rounded-xl space-y-4 shadow-lg">
                    <div className="flex justify-between items-center border-b border-[#333] pb-2 mb-4">
                        <h2 className="text-lg text-white font-medium">Technical Specifications</h2>
                        <button
                            type="button"
                            onClick={addSpecRow}
                            className="flex items-center gap-1 text-[#C9A84C] hover:text-[#FFD700] text-sm font-medium"
                        >
                            <FiPlus /> Add Row
                        </button>
                    </div>

                    <div className="space-y-3">
                        {specsList.map((spec, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        placeholder="e.g. Engine, Size, Location"
                                        value={spec.key}
                                        onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                                        className="lux-input"
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <input
                                        placeholder="Value..."
                                        value={spec.value}
                                        onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                        className="lux-input"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSpec(idx)}
                                    className="p-3 text-gray-500 hover:text-red-500 bg-[#111] border border-[#333] hover:border-red-900 rounded"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}
                        {specsList.length === 0 && (
                            <p className="text-gray-500 italic text-sm text-center py-4">No specifications added. Click "Add Row" to begin.</p>
                        )}
                    </div>
                </div>

            </form>
        </div>
    );
};

export default ListingForm;
