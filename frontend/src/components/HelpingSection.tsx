import React from 'react';
import { ClipboardList, Search, ClipboardCheck } from 'lucide-react';

interface Props {
    title: string;
    icon: React.ReactElement;
    description: string;
}

const Feature = ({ title, icon, description }: Props) => (
    <div className="feature-card p-6 rounded-lg shadow-md flex flex-col items-center bg-white dark:bg-[#2E3A52] hover:shadow-lg transition-shadow cursor-pointer">
        <div className="icon-container rounded-full p-4 bg-lightGreen dark:bg-[#6D758C] shadow-md">
            {icon}
        </div>
        <h3 className="text-xl font-bold mt-4 text-center text-darkGreen dark:text-white">{title}</h3>
        <p className="text-gray-600 mt-2 text-center dark:text-yellow-50">{description}</p>
    </div>
);

const HelpingSection = () => {
    const features = [
        {
            title: 'Easy Registration',
            icon: <ClipboardList className="h-12 w-12 text-green-500" />,
            description:
                'Sign up for events effortlessly with a few clicks and secure your spot.',
        },
        {
            title: 'Discover Events',
            icon: <Search className="h-12 w-12 text-green-500" />,
            description:
                'Browse and explore a variety of events to find what matches your interests.',
        },

        {
            title: 'Seamless Management',
            icon: <ClipboardCheck className="h-12 w-12 text-green-500" />,
            description:
                'Easily manage your registrations, track participation, and access event details.',
        },
    ];


    return (
        <div className="container mx-auto pb-12 px-4 md:px-8">
            <h1 className='text-2xl font-semibold mb-4'>What We Offer</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Feature
                        key={index}
                        title={feature.title}
                        icon={feature.icon}
                        description={feature.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default HelpingSection;