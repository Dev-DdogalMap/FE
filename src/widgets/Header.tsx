import logo from '@/assets/images/logo.png';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-center bg-white px-4">
      <img
        src={logo}
        alt="또갈지도"
        className="h-8 w-auto"
      />
    </header>
  );
}