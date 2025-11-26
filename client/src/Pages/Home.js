import React from 'react';
import { Zap, Shield, Activity, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCards';

const Home = () => {
    // Feature data for mapping
    const features = [
        {
            title: "Attack Simulator",
            description: "Launch real-world threats like SQLi & XSS in a safe, contained environment.",
            icon: Zap,
            color: "bg-red-600"
        },
        {
            title: "AI Defense Engine",
            description: "Observe a custom middleware engine detect, classify, and block malicious payloads.",
            icon: Shield,
            color: "bg-green-600"
        },
        {
            title: "Live Traffic Monitoring",
            description: "View a real-time stream of network traffic, differentiating attacks (RED) from safe requests (GREEN).",
            icon: Activity,
            color: "bg-blue-600"
        },
        {
            title: "Detailed Audit Logs",
            description: "Analyze historical events, including payload, severity, and suggested mitigation steps.",
            icon: Film,
            color: "bg-yellow-600"
        }
    ];

    return (
        <div className="min-h-screen pt-16 pb-12 bg-gray-950">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-20">
                <h1 className="text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">
                    CyberGuard 360
                </h1>
                <p className="text-4xl font-semibold mb-6 text-cyan-400">
                    The Interactive Cyber Defense Sandbox
                </p>
                <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
                    A full-stack, MERN-powered platform designed to teach web security by demonstrating 
                    the <b>execution</b> and <b>real-time defense</b> against major cyber threats.
                </p>
                
                {/* Call to Action (CTA) */}
                <Link to="/monitor">
                    <button className="px-8 py-3 bg-cyan-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-cyan-500 transition-all transform hover:scale-105 mr-4">
                        View Live Monitor
                    </button>
                </Link>
                <Link to="/Launch">
                    <button className="px-8 py-3 bg-red-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-500 transition-all transform hover:scale-105">
                        Launch Simulator
                    </button>
                </Link>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center text-4xl font-bold mb-12 text-white">
                    Core Functionality
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            color={feature.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;