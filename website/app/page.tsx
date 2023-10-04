"use client"
import mapboxgl, { Map } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent
} from "@/components/ui/card"

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9yaXNkZWxvcm1lIiwiYSI6ImNsbXU3MzEwZjBicHgycW1xNG1hN29ldXIifQ.ommqbzSD7Ey152shCR1ZIQ';


const MapboxMap = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapNode = useRef(null);

  function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
  }

  useEffect(() => {
    const node = mapNode.current
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      center: [2.252616, 48.841465],
      zoom: 16,
      pitch: 60
    });

    mapboxMap.on('style.load', () => {
      //@ts-ignore
      mapboxMap.setConfigProperty('basemap', 'lightPreset', 'night');
    })

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove()
    }
  }, [])

  return <div ref={mapNode} className='w-full h-full' />
}

export default function Home() {

  return (
    <main className='flex items-center justify-center h-screen'>
      <div className='flex items-end w-[350px] h-[600px] relative overflow-hidden rounded-xl'>
        <div className="w-[350px] h-[600px] top-0 left-0 absolute">
          <MapboxMap />
        </div>
        <div className="h-[200px] z-10 backdrop-blur-xl w-full"></div>
      </div>
    </main>
  )
}
