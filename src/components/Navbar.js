import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-yellow-500 text-2xl font-bold">AnimeHub</a>
        </Link>
        <div>
          <Link href="/" legacyBehavior>
            <a className="text-gray-300 hover:text-white mx-2">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-gray-300 hover:text-white mx-2">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-gray-300 hover:text-white mx-2">Contact</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
