import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pomodoro", destination: "/focus", permanent: false },
      { source: "/kids/truma/focus", destination: "/focus", permanent: false },
    ];
  },
};

export default nextConfig;
