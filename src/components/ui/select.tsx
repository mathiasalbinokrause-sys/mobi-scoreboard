import { useState, useRef, useEffect } from "react";

export default function StableSelect({
  value,
  onValueChange,
  placeholder = "Selecione...",
  options = [],
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Fecha quando clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* BOTÃO */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          w-full px-3 py-2 rounded-md border
          bg-white text-black
          flex justify-between items-center
          transition
          hover:bg-gray-100
        "
      >
        <span>{selectedLabel}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {/* LISTA */}
      {open && (
        <div
          className="
            absolute left-0 top-[110%] z-20
            w-full bg-white border rounded-md shadow-md
            max-h-60 overflow-auto
          "
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onValueChange(opt.value);
                setOpen(false);
              }}
              className="
                px-3 py-2 cursor-pointer
                hover:bg-gray-100
              "
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
