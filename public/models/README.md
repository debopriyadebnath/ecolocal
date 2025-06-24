# 3D Models Directory

This directory contains the 3D models used in the AR product preview feature.

## Required Models

1. `water-bottle.glb` - A 3D model of an eco-friendly water bottle
2. `cutlery-set.glb` - A 3D model of a bamboo cutlery set

## Model Requirements

- Format: GLB (GL Binary)
- Size: Optimized, less than 5MB per model
- Textures: Embedded in GLB file
- Dimensions: Normalized to reasonable display size

## Getting Models

You can get models from the following sources:

1. [Sketchfab](https://sketchfab.com/) - Many free and paid 3D models
2. [Google Poly](https://poly.google.com/) - Free 3D models
3. [TurboSquid](https://www.turbosquid.com/) - Professional 3D models

## Adding New Models

1. Download the GLB file
2. Optimize it using tools like [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
3. Place the optimized file in this directory
4. Update the `SAMPLE_PRODUCTS` array in `app/ar/page.tsx` with the new model information
