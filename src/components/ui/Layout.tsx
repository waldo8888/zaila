interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="
      min-h-screen w-full
      grid grid-rows-[auto_1fr_auto]
      bg-gradient-to-b from-gray-900 to-gray-800
    ">
      {/* Main content area with proper spacing and responsive grid */}
      <div className="
        relative w-full max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8 lg:py-12
      ">
        {children}
      </div>
    </div>
  );
}
