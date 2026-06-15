import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/services/avtoelektryk", destination: "/services/car-avtoelektryk", permanent: true },
      { source: "/services/perevirka", destination: "/services/car-perevirka", permanent: true },
      { source: "/services/shynomontazh", destination: "/services/car-shynomontazh", permanent: true },
      { source: "/services/hodova", destination: "/services/car-hodova", permanent: true },
      { source: "/services/detaley", destination: "/services/car-zapchastyny", permanent: true },
    ];
  },
};

export default nextConfig;
