import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pomodoro", destination: "/focus", permanent: false },
      { source: "/kids/truma/focus", destination: "/focus?kid=truma", permanent: false },
      { source: "/kids/titus/focus", destination: "/focus?kid=titus", permanent: false },
      { source: "/kids/mercy/focus", destination: "/focus?kid=mercy", permanent: false },
      { source: "/kids/lois/focus", destination: "/focus?kid=lois", permanent: false },
    ];
  },
};

export default nextConfig;
