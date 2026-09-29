# frontend-interview

Starter for the Adamo VR teleop frontend interview.

## Setup

```
npm install
cp .env.local.example .env.local   # fill in VITE_ADAMO_API_KEY and VITE_ROBOT_ID
npm run dev
```

## What's here

A minimal, undesigned connection to a robot's video feed using the `adamo`
and `adamo-react` npm packages: `AdamoProvider`, robot discovery, and a raw
`<Stream>` tag. No layout, no VR, no controls — that's the exercise.
