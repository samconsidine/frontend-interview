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

The app connects to a fixed demo robot (`interview-sim`, a simulated feed) —
no further config needed.

## What's here

A minimal, undesigned connection to a robot's video feed using the `adamo`
and `adamo-react` npm packages: `AdamoProvider`, robot discovery, and a raw
`<Stream>` tag. No layout, no VR, no controls — that's the exercise.
