import { ChildrenType } from '../types/children-type';

interface CardType extends ChildrenType {
  className?: string;
  customStyle?: string;
}

export default function Card({ children, className = '', customStyle }: CardType) {
  return (
    <div className={`${customStyle ? customStyle : 'w-[400px]'} rounded-2xl bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}
