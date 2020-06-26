# CharityBase API + Web App

## Installing

```bash
yarn # or npm install
```

## Developing

```bash
cp .env .env.local # then update values in .env.local
yarn dev
```

## Deploying

Ensure preview & production env vars are set in Vercel dashboard.

Automated with pushes to GitHub. Or manually (after installing Vercel CLI):

```bash
yarn deploy:production
```
