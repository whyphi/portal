// Disclosure: code inspired by example from https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o?file=/src/App.tsx
import React, { useState, useRef, useEffect } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import { CanvasPreview } from './CanvasPreview'
import { useDebounceEffect } from '@/utils/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import { Button, FileInput } from 'flowbite-react'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

interface CropyImageProps {
  eventCoverImage: string;
  eventCoverImageName: string;
  onChange: ([eventCoverImage, eventCoverImageName]: [string, string]) => void;
}

export default function CropImage({
  eventCoverImage,
  eventCoverImageName,
  onChange,
}: CropyImageProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [imgName, setImgName] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // state variables to keep track of which elements to render
  const [displayReactCrop, setDisplayReactCrop] = useState(true);
  const [isInitialModifyLoad, setIsInitialModifyLoad] = useState(eventCoverImage !== "");

  const aspect = 16 / 9  

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fullFilename = file.name;
      const filenameWithoutExtension = fullFilename.substring(0, fullFilename.lastIndexOf('.')) || fullFilename;
      setImgName(filenameWithoutExtension);

      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(file);
      
      // show ReactCrop editor
      setDisplayReactCrop(true);
    } else if (!isInitialModifyLoad) {
      // show ReactCrop editor
      setDisplayReactCrop(false);
      
      // reset completedCrop (no file is chosen)
      setCompletedCrop(undefined);
      
      // reset eventCoverImage/eventCoverImageName, imgName, amnd imgSrc
      onChange(["", ""]);

      setImgName("");

      setImgSrc("");
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onSaveCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Create an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size

    // Convert the canvas to a base64 data URL
    const base64Image = canvas.toDataURL('image/png');
    onChange([base64Image, imgName]);

    // hide ReactCrop editor
    setDisplayReactCrop(false);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        CanvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop
        )
      }
    },
    100,
    [completedCrop],
  );

  return (
    <div className="App">
      <div className="Crop-Controls">
        <FileInput 
          accept="image/*" 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // no longer first load
            setIsInitialModifyLoad(false);
            onSelectFile(e);
          }} 
        />
      </div>
      {(!!imgSrc && displayReactCrop && !isInitialModifyLoad) && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minHeight={100}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (displayReactCrop ? 
        <div>
          <canvas
            hidden // note: remove to display a real-time preview of the crop
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
          <Button onClick={onSaveCropClick}>Save Crop</Button>
        </div>
        :
        <div>
          <img src={eventCoverImage} alt={eventCoverImageName} />
          <Button onClick={() => setDisplayReactCrop(true)}>Edit Crop</Button>
        </div>
      )}
      {/* edge case (first load --> display image) */}
      {isInitialModifyLoad && 
        <img
          src={eventCoverImage}
          alt={eventCoverImageName}
        />
      }
    </div>
  )
}
