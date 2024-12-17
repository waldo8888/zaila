interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="text-center max-w-4xl mx-auto">
      <h1 className="
        text-3xl sm:text-4xl lg:text-5xl
        font-bold tracking-tight
        text-white
        mb-4
      ">
        {title}
      </h1>
      {subtitle && (
        <p className="
          text-lg sm:text-xl
          text-gray-300
          max-w-2xl mx-auto
        ">
          {subtitle}
        </p>
      )}
    </header>
  );
}
