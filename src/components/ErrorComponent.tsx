import { ChildrenType } from '../types/children-type';

interface ErrorComponentProps extends ChildrenType {
  className?: string;
}

export default function ErrorComponent({
  className,
  children,
}: ErrorComponentProps) {
  return (
    <div className={`text-red-600 text-center text-sm ${className || ''}`}>
      {children}
    </div>
  );
}
