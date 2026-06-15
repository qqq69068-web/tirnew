import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // Old slugs without prefix → correct DB slugs
      { source: "/services/avtoelektryk",  destination: "/services/car-elektrika",  permanent: true },
      { source: "/services/perevirka",     destination: "/services/car-diagnostyka", permanent: true },
      { source: "/services/shynomontazh", destination: "/services/car-rozval",      permanent: true },
      { source: "/services/hodova",        destination: "/services/car-pidviska",    permanent: true },
      { source: "/services/detaley",       destination: "/services/car-zapchastyny", permanent: true },

      // Wrong car- slugs that don't exist in DB → correct ones
      { source: "/services/car-avtoelektryk", destination: "/services/car-elektrika",   permanent: true },
      { source: "/services/car-perevirka",    destination: "/services/car-diagnostyka", permanent: true },
      { source: "/services/car-shynomontazh", destination: "/services/car-rozval",      permanent: true },
      { source: "/services/car-hodova",       destination: "/services/car-pidviska",    permanent: true },
      { source: "/services/zamovlennya-detaley", destination: "/services/car-zapchastyny", permanent: true },
    ];
  },
};

export default nextConfig;
