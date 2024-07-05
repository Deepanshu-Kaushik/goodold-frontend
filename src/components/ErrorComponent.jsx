export default function ErrorComponent({ className, children }) {
  return (
    <div className={`text-red-600 text-center text-sm ${className || ''}`}>
      {children}
    </div>
  );
}
