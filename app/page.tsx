'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as fal from "@fal-ai/serverless-client";
import Image from 'next/image';
import P5Block from './p5block'; // Make sure this path matches the location of your P5Block component
;

fal.config({
  proxyUrl: "/api/fal/proxy",
});

//const seed = 110602490;
const seed = Math.floor(Math.random() * 100000);

export default function Home() {
  const [input, setInput] = useState('hyper-realistic, HD, 3D, black background, dramatic light and elliptic volumes,  complexity floating organic growth tendrils glowing transparent cells, many brains slime mold neuronal blood bones glass diatom vectors vortex architectures of water, fire, light, oil, smoke and internal light and strange colors no gravity');
  // const [input, setInput] = useState('3D, balck background, dramatic light, complex system, liquid light, hight dimensional spaces, non euclidian, meta abstraction,  blackhole,  internal sun neuron, morphing black and white, networks');
  const [strength, setStrength] = useState(0.75);
  const [image, setImage] = useState(null);

  const [isClient, setIsClient] = useState<boolean>(false);
  const [audioSrc, setAudioSrc] = useState('/balckbox.mp3');

  useEffect(() => { setIsClient(true) }, []);

  const { send } = fal.realtime.connect('110602490-sdxl-turbo-realtime', {
    connectionKey: 'fal-ai/fast-lightning-sdxl',
    onResult(result) {
      if (result.error) return;
      setImage(result.images[0].url);
    }
  });

  const captureAndSendImage = useCallback(async () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const image_url = canvas.toDataURL();
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      send({
        sync_mode: true,
        strength: strength,
        seed: seed,
        prompt: input,
        width: 512,
        height: 512,

        image_url: image_url
      });
    }
  }, [strength, input, send]); // captureAndSendImage's dependencies

  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        captureAndSendImage();
      }, 10); // Automatically capture and send image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isClient, captureAndSendImage]); // useEffect's dependencies, including captureAndSendImage

  return (
    <main className="bg-black flex flex-col items-center justify-center ">
   
    <div className="relative min-h-screen bg-black text-white">
    
      <div className="absolute top-0 left-0 w-full h-full">
        {isClient && <P5Block />}
      </div>
      <div className="image-wrapper">
      <div className="image-wrapper" style={{ opacity: 0.9,  width: 512, height: 512 }}>
  <Image

    src= {image || '/placeholder.png'}

    layout="fill"
    objectFit="cover"
    alt="Generated Image"
  />

</div>
      </div>


  
      {/* <div className="mb-4">
        <p className="text-xl mb-2">play sound, press spacebar to reset the canvas and move the mouse to draw and interact with the generative design and AI model.</p>
        <p className="text-xl mb-2">concept, generative design, programming, and music by <a href="https://linktr.ee/marlonbarriososolano" target="_blank" rel="noopener noreferrer">Marlon Barrios Solano</a></p>
      </div> */}
    </div>
  </main>
 
  );
}
