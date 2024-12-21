'use client';
import { useState } from 'react';
import { IoCameraOutline, IoCloseCircle } from 'react-icons/io5';

export default function AddPhoto({ image, onUpload, onDelete, id, size = 'small' }) {
  // const [filename, setFilename] = useState("");
  // const [fileType, setFileType] = useState("");
  // const [imageBase64, setImageBase64] = useState("");


  // const [filename, setFilename] = useState("");
  // const [fileType, setFileType] = useState("");
  // const [imageBase64, setImageBase64] = useState("");



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {


        let imageBase64 = reader.result;//.split(",")[1];
        const filename = file.name;
        const fileType = file.type;

        // console.log(filename);
        // console.log(fileType);
        // console.log(imageBase64);



        //setImage(imageBase64);
        //imageBase64 = imageBase64.split(",")[1];
        onUpload(filename,fileType,imageBase64);
        //onUpload(imgURL);



        //console.log(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {

    onDelete(id);

  };

  return (
    <div className={`flex items-center justify-center border-2 border-gray-200 rounded-md relative group ${size == 'large'? 'w-full h-24 md:w-full md:h-52' : 'w-24 h-24 md:w-26 md:h-26 lg:w-36 lg:h-36'}`}>
      {image ? (
        <div className="w-full h-full relative">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-md"
          />
          <button
            onClick={handleImageRemove}
            className="absolute top-1 right-1 rounded-full p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            type='button'
          >
            <IoCloseCircle size={24} />
          </button>
        </div>
      ) : (
        <label
          
          htmlFor="dropzone-file"
          className="w-full h-full flex items-center justify-center border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div   data-testid="photo" className="w-12 h-12 border-2 border-dotted border-blue-500 flex items-center justify-center rounded-md">
            <IoCameraOutline color="blue" size={30} />
          </div>
          <input
            data-testid="photoUpload"
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>
  );
}
