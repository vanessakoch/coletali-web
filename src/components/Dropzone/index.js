import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiImageAdd } from 'react-icons/bi';

import './styles.css';

function Dropzone({ onFileUpload }) {
  const [fileUrl, setFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setFileUrl(fileUrl)

    onFileUpload(file)
  }, [onFileUpload])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />

      { fileUrl
        ? <img src={fileUrl} alt="Imagem da localização" />
        : (
          <p>
            <BiImageAdd />
            Clique ou arraste uma imagem para o ponto de coleta
          </p>
        )
      }
    </div>
  )
}

export default Dropzone;
