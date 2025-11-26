import React from 'react';
import { ChevronRight } from 'lucide-react';  

const FeatureCard = ({ title, description, icon: Icon, color }) => {
  return (
    <div className="p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 group">
      <div className={`p-3 w-12 h-12 rounded-lg ${color} text-white mb-4 shadow-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <a href="#" className="flex items-center text-cyan-400 font-semibold hover:text-cyan-300">
        Explore <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
};

export default FeatureCard;