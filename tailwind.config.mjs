/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#FFFFFF', // White
                secondary: '#F8FAFC', // Slate 50
                'text-main': '#0F172A', // Slate 900
                accent: '#0EA5E9', // Sky 500
                'accent-glow': '#38BDF8', // Sky 400
                'wave-blue': '#0284C7', // Sky 600 - Stronger blue for particles
                'sun-orange': '#FF7700', // Deeper vivid Sun Orange
                'swiss-white': '#F4F4F0', // Warm White
                'swiss-black': '#1A1A1A', // Soft Black
                'swiss-red': '#FF4400', // International Orange
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Orbitron', 'monospace'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom, #FFFFFF, #FFFFFF)', // Pure White
                'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
            },
            boxShadow: {
                'sun-glow': '0 0 20px rgba(255, 119, 0, 0.6), 0 0 60px rgba(255, 119, 0, 0.3)', // Glow effect
                'hard': '8px 8px 0px 0px rgba(0,0,0,1)', // Neo-Brutalist Hard Shadow
                'hard-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
                'hard-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'gentle-float': 'gentleFloat 6s ease-in-out infinite',
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-subtle': 'fadeSubtle 1.5s ease-out forwards',
                'scale-appear': 'scaleAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'sunrise': 'sunrise 2.5s cubic-bezier(0.22, 1, 0.36, 1) both', // Changed 'forwards' to 'both' to apply 0% state during delay
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gentleFloat: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(1deg)' },
                },
                sunrise: {
                    '0%': { transform: 'translateY(110%)', opacity: '0' }, // Start fully invisible
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeSubtle: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleAppear: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
