import {RcFile} from 'antd/es/upload';

type Response = {
  width: number;
  height: number;
};

export const getImageDimensions = (file: RcFile): Promise<Response> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
