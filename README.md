# frontend-interview

Starter for the Adamo VR teleop frontend interview.

## Setup

```
npm install adamo adamo-react react react-dom
npm install
cp .env.local.example .env.local
```

Set `VITE_ADAMO_API_KEY` in `.env.local` to the API key given to you for this
interview, then:

```
npm run dev
```

The app connects to a fixed demo robot (`yam-box-sim`, a MuJoCo simulation of
two YAM arms) — no further config needed. It publishes one video track,
`main`: a ZED-Mini-style stereo pair, left and right eye packed side by side
in a single 2560x720 frame. Splitting that into a proper stereo VR view is
part of the exercise.

## What's here

A minimal, undesigned connection to a robot's video feed using the `adamo`
and `adamo-react` npm packages: `AdamoProvider`, robot discovery, and a raw
`<Stream>` tag. No layout, no VR, no controls — that's the exercise.
