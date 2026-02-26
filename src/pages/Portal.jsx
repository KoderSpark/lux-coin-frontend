import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ListingCard from '../components/ListingCard';
import { FiSearch } from 'react-icons/fi';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Sphere, Float } from '@react-three/drei';

// Interactive 3D Background Component
const Scene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#C9A84C" />

            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
                <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
                    <MeshDistortMaterial
                        color="#0D0D0D"
                        envMapIntensity={2}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.4}
                        speed={1.5}
                    />
                </Sphere>
            </Float>

            <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
                <Sphere args={[0.5, 32, 32]} position={[2.5, 1.5, -1]}>
                    <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
                </Sphere>
            </Float>

            <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[0.8, 32, 32]} position={[-3, -1, -2]}>
                    <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
                </Sphere>
            </Float>

            <Environment preset="city" />
        </Canvas>
    );
};

const Portal = () => {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const categories = ['Islands', 'Luxury Cars', 'Chartered Flights', 'Helicopters', 'Luxury Watches'];

    useEffect(() => {
        fetchData();
    }, [searchTerm, selectedCategory]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const featuredRes = await api.get('/listings?featured=true');
            setFeaturedListings(featuredRes.data);

            let queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (selectedCategory) queryParams.append('category', selectedCategory);

            const allRes = await api.get(`/listings?${queryParams.toString()}`);
            setAllListings(allRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="bg-[#0D0D0D] min-h-screen pb-12">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
                <div className="absolute inset-0 z-0">
                    <Scene />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/10 via-transparent to-[#0D0D0D] pointer-events-none"></div>
                </div>

                <div className="z-10 text-center max-w-4xl px-4 mt-8 pointer-events-none">
                    <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight">
                        Curated Excellence for the <span className="text-[#C9A84C] italic">Extraordinary</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl tracking-wide max-w-2xl mx-auto mb-10">
                        Exclusive access to the world's most sought-after assets.
                    </p>

                    <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto pointer-events-auto">
                        <input
                            type="text"
                            placeholder="Search our collection..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1A1A1A]/80 backdrop-blur-md border border-[#333] focus:border-[#C9A84C] text-white px-6 py-4 rounded-full outline-none transition-all pl-12 shadow-2xl"
                        />
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C9A84C] text-[#0D0D0D] px-6 py-2 rounded-full font-medium hover:bg-[#FFD700] transition-colors">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Categories Bar */}
            <div className="bg-[#141414] py-6 border-y border-[#333]">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all ${selectedCategory === ''
                            ? 'bg-[#C9A84C] text-[#0D0D0D] font-medium'
                            : 'text-gray-400 border border-[#333] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                            }`}
                    >
                        All Collections
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all ${selectedCategory === cat
                                ? 'bg-[#C9A84C] text-[#0D0D0D] font-medium'
                                : 'text-gray-400 border border-[#333] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Featured Section */}
                {featuredListings.length > 0 && !selectedCategory && !searchTerm && (
                    <section className="mb-16">
                        <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4">
                            <h2 className="font-serif text-3xl text-white">Featured Acquisitions</h2>
                        </div>

                        <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
                            {featuredListings.map(listing => (
                                <div key={listing._id} className="min-w-[320px] md:min-w-[400px] snap-center">
                                    <ListingCard listing={listing} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All/Filtered Listings */}
                <section>
                    <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4">
                        <h2 className="font-serif text-3xl text-white">
                            {selectedCategory ? `${selectedCategory}` : 'The Collection'}
                        </h2>
                        <Link to="/portal/listings" className="text-[#C9A84C] hover:text-[#FFD700] text-sm uppercase tracking-widest transition-colors flex items-center">
                            View All <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : allListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allListings.map(listing => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No acquisitions found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                                className="mt-4 text-[#C9A84C] underline underline-offset-4"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default Portal;
