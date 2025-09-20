/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: () => {
        return [
            {
                source: '/',
                destination: '/users',
                permanent: true,
            },
        ]
    },
    rewrites: () => {
        return [
            {
                source: '/api/:path*',
                destination: process.env.BACKEND_API_URL + '/:path*',
            },
        ]
    }
};

export default nextConfig;
