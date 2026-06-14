import { useState } from "react"

export default function Input({
  submit,
  disabled = false,
}: {
  submit: (id: string) => void;
  disabled?: boolean;
}) {
  const [data, setData] = useState("");

  const handleSubmit = () => {
    if (data.trim() && !disabled) {
      submit(data);
      setData("");
    }
  };

  return (
    <div>
      <textarea
        style={{ height: "100px" }}
        className="rounded shadow resize-none p-4 w-full border border-gray-300 outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
        placeholder={disabled ? "Waiting for response..." : "Enter your Question"}
        value={data}
        disabled={disabled}
        onChange={(e) => {
          setData(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      <div className="rounded mt-2 flex flex-row justify-end">
        <button
          className="rounded bg-blue-600 color-blue-300 px-4 py-2 text-white w-16 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSubmit}
          disabled={disabled}
        >
          {disabled ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}