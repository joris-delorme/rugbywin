import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9yaXNkZWxvcm1lIiwiYSI6ImNsbXU3MzEwZjBicHgycW1xNG1hN29ldXIifQ.ommqbzSD7Ey152shCR1ZIQ'

const MapComponent = ({ lat, lon }: { lat: number, lon: number }) => {
    const mapContainer = useRef<HTMLDivElement>(null)
    let map: mapboxgl.Map

    useEffect(() => {
        map = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            center: [lon, lat],
            zoom: 17,
            pitch: 70
        })
        map.scrollZoom.disable()
        map.boxZoom.disable()
        function rotateCamera(timestamp: number) {
            map.rotateTo((timestamp / 100) % 360, { duration: 0 });
            requestAnimationFrame(rotateCamera);
        }

        map.on('style.load', () => {
            //@ts-ignore
            map.setConfigProperty('basemap', 'lightPreset', 'night')
            //@ts-ignore
            map.setConfigProperty('basemap', 'showRoadLabels', false)
            //@ts-ignore
            map.setConfigProperty('basemap', 'showTransitLabels', false)
            //@ts-ignore
            map.setConfigProperty('basemap', 'showPlaceLabels', false)
            rotateCamera(0)
        })

        return () => { map.remove() }
    }, [lat, lon])

    return (
        <div ref={mapContainer} className="cursor-pointer select-none w-full h-full" />
    )
}

export default MapComponent
