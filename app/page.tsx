"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  if (!user && !userSession) {
    router.push('/auth/register');
  }

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
    // Data: UN Human Development Index 2017 Europe extract
    // Source: https://ourworldindata.org/human-development-index
    const [data, setData] = useState([
      { code: '', hdi: 0 },
    ]);

    const addCountry = (newCountry: { code: string; hdi: number }) => {
      setData((prevData) => {
        // Check if the country already exists in the data
        const countryExists = prevData.some(country => country.code === newCountry.code);
        
        if (countryExists) {
          // If it exists, remove it from the state
          return prevData.filter(country => country.code !== newCountry.code);
        } else {
          // If it does not exist, add it to the state
          return [...prevData, newCountry];
        }
      });
    };

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY20xanB2OXRoMTFzeTJrc2VzcDBpMDBjNiJ9.7Tp_blB21BnL5mAy4kShaA';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12, 50],
      zoom: 2.2
    });

    mapRef.current.on('load', () => {
      // Add source for country polygons using the Mapbox Countries tileset
      // The polygons contain an ISO 3166 alpha-3 code which can be used to
      // for joining the data
      // https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
      mapRef.current!.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Build a GL match expression that defines the color for every vector
      // tile feature. Use the ISO 3166-1 alpha 3 code as the lookup key
      // for the country shape
      const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];

      // Calculate color values for each country based on 'hdi' value
      for (const row of data) {
        // Convert the range of data values to a suitable color
        const green = row['hdi'] * 255;
        const color = `rgb(0, ${green}, 0)`;

        matchExpression.push(row['code'], color);
      }

      // Last value is the default, used where there is no data
      matchExpression.push('rgba(0, 0, 0, 0)');

      // The mapbox.country-boundaries-v1 tileset includes multiple
      // polygons for some countries with disputed borders.  The
      // following expression filters the map view to show the
      // "US" perspective of borders for disputed countries.
      // Other world views are available, for more details, see
      // the documentation on the "worldview" feature property at
      // https://docs.mapbox.com/data/tilesets/reference/mapbox-countries-v1/#--polygon---worldview-text
      const WORLDVIEW = 'US';
      const worldview_filter = [
        'all',
        ['==', ['get', 'disputed'], 'false'],
        [
          'any',
          ['==', 'all', ['get', 'worldview']],
          ['in', WORLDVIEW, ['get', 'worldview']]
        ]
      ];

      // Add layer from the vector tile source to create the choropleth
      // Insert it below the 'admin-1-boundary-bg' layer in the style
      mapRef.current!.addLayer(
        {
          id: 'countries-join',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': matchExpression as mapboxgl.ExpressionSpecification,
          },
          filter: worldview_filter
        },
        'admin-1-boundary-bg'
      );

      mapRef.current!.on('click', 'countries-join', (e) => {
        const countryCode = e.features![0].properties!.iso_3166_1_alpha_3;
        
        console.log(countryCode);
        console.log();
        console.log(data);
        addCountry({code: countryCode, hdi: 1});
      })
    });

    return () => {
      mapRef.current!.remove();
    };
  }, [data]);

  return <div ref={mapContainerRef} id="map" style={{ height: '100vh' }}/>;
};

export default Map;