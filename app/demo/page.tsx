'use client'

import { PortfolioView } from '@/components/portfolio/portfolio-view'

export default function DemoPage() {
    const profile = {
        username: 'showcase',
        full_name: 'Alex Rivera',
        website: 'https://alexrivera.dev',
    }

    const portfolio = {
        title: 'Senior Product Designer & Creative Developer',
        bio: 'Building world-class digital products with a focus on motion, minimalism, and meaningful user experiences. Currently based in Seoul.',
        skills: ['React', 'TypeScript', 'Next.js', 'Framer Motion', 'PostgreSQL', 'UI/UX Design'],
    }

    const mainProjects = [
        {
            id: '1',
            name: 'Linear Dashboard Client',
            description: 'A performance-focused project management interface inspired by Linear. Built with deep attention to keyboard shortcuts and micro-interactions.',
            url: 'https://linear.app',
            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
            tech_stack: ['Next.js', 'Tailwind', 'Motion'],
        },
        {
            id: '2',
            name: 'Vogue Motion Concept',
            description: 'Immersive digital experience for high-fashion brands, utilizing complex horizontal scrolling and parallax effects.',
            url: 'https://vogue.com',
            image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop',
            tech_stack: ['React', 'Three.js', 'Framer'],
        },
    ]

    const toyProjects = [
        {
            id: '3',
            name: 'Zen Timer',
            description: 'Minimalist meditation timer with procedural ambient sound generation.',
            image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
            tech_stack: ['Web Audio API'],
        },
        {
            id: '4',
            name: 'Abstract Grid 01',
            description: 'Ongoing exploration of generative grid layouts using CSS Houdini.',
            image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
            tech_stack: ['Houdini', 'Canvas'],
        },
    ]

    return (
        <div className="relative">
            <div className="fixed top-24 left-8 z-[60] print:hidden">
                <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse">
                    DEMO MODE
                </div>
            </div>
            <PortfolioView
                profile={profile}
                portfolio={portfolio}
                mainProjects={mainProjects}
                toyProjects={toyProjects}
            />
        </div>
    )
}
