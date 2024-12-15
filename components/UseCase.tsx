import { IconType } from 'react-icons';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface UseCaseProps {
  title: string;
  subtitle: string;
  description: string;
  whyItMatters: string;
  example: string;
  Icon: IconType;
}

export default function UseCase({ title, subtitle, description, whyItMatters, example, Icon }: UseCaseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-900 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition-colors"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className="text-blue-400 flex-shrink-0">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 font-medium mb-3">{subtitle}</p>
          <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-20'} overflow-hidden`}>
            <p className="text-gray-400 mb-4">{description}</p>
            {isExpanded && (
              <>
                <div className="mt-4">
                  <h4 className="text-white font-semibold mb-2">Why It Matters:</h4>
                  <p className="text-gray-400">{whyItMatters}</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-white font-semibold mb-2">Example Use Case:</h4>
                  <p className="text-gray-400">{example}</p>
                </div>
              </>
            )}
          </div>
          <button 
            className="text-blue-400 mt-4 text-sm hover:text-blue-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'Show Less' : 'Learn More'}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 