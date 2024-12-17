interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
    </header>
  );
}
