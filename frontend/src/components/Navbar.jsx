import { MdCorporateFare } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-2">
          <MdCorporateFare className="text-2xl" />
          <h2 className="text-lg font-semibold text-gray-800">
            Company Incorporation
          </h2>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
