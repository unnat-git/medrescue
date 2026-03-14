"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// @ts-ignore
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full w-full p-8 bg-gray-50 rounded-lg border border-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      <span className="ml-2 text-slate-500">Loading map...</span>
    </div>
  ),
});

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  height?: string;
  markers?: Array<{
    position: [number, number];
    label: string;
    type?: 'patient' | 'hospital' | 'ambulance';
  }>;
  polyLine?: [number, number][];
}

export default function MapComponent(props: MapComponentProps) {
  return <DynamicMap {...props} />;
}

