import { useState } from "react";

type Props = {
  onChange: ()=>{};
  items: string[];
}

const DropdownMenu = ({...props}:Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(props.items[0]);

  const items = props.items;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSelect = (item: string) => {
    props.onChange(item);
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="bg-blue-500 text-white px-4 py-2 rounded-l-md hover:bg-blue-600"
      >
        {selected}
      </button>
      <button
        onClick={toggleMenu}
        className="bg-blue-500 text-white px-1 py-2 rounded-r-md hover:bg-blue-600"
        style={{marginLeft:"0.5px"}}
      >
        ▼
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;