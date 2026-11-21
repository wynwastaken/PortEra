# PortEra - Live Checkout Summary

The `/pemesanan` page uses React `useState` to keep the order form and checkout summary synchronized.

## Reactive selections
- Package selection updates the package name, description, base price, and total.
- Express 24 Jam and CV ATS add-ons update the add-on rows and total.
- Visual style and color palette selections update the summary labels.
- Target industry, portfolio language, and academic status are reflected in the summary.
- Selecting Express 24 Jam changes the estimated delivery label to 1x24 hours.

## Run
```bash
npm install
npm run dev
```
