import React from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

type PreviewImage = {
  previewImage: string;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
};

export default function PreviewImage({ previewImage, setPreviewImage }: PreviewImage) {
  return (
    <div className='absolute top-0 left-0 h-full w-full flex items-center justify-center backdrop-contrast-50 dark:backdrop-contrast-100 backdrop-blur-lg z-50'>
      <div className='relative max-w-[90%] mx-auto'>
        <img src={previewImage} alt='Preview Image' className='max-h-[700px]' />
        <IoMdCloseCircle
          className='absolute -top-3 -right-2.5 text-2xl md:text-4xl cursor-pointer text-red-600 bg-white rounded-full'
          onClick={(e) => {
            e.preventDefault();
            setPreviewImage('');
          }}
        />
      </div>
    </div>
  );
}
