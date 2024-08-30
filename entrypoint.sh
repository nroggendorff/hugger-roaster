#!/bin/bash
npm run build && npx prisma generate && npx prisma migrate deploy && npx prisma db push && npm start