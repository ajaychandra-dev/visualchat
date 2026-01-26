export default function Logo() {
  return (
    <div className="flex flex-row gap-3 items-center">
      <img src={"/icons/logo.svg"} draggable={false} className="select-none" />
      <p className="text-xl font-medium text-input select-none opacity-75">
        VisualChat
      </p>
    </div>
  );
}
