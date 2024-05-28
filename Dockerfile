# Étape 1 : Utiliser une image de base appropriée
FROM node:18-alpine AS build

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers de configuration nécessaires
COPY package.json pnpm-lock.yaml ./

# Étape 4 : Installer pnpm
RUN npm install -g pnpm

# Étape 5 : Installer les dépendances
RUN pnpm install

# Étape 6 : Copier le reste des fichiers de l'application
COPY . .

# Étape 7 : Construire l'application
RUN pnpm run build

# Étape 8 : Prendre une nouvelle image légère pour la production
FROM node:18-alpine AS production

# Étape 9 : Définir le répertoire de travail
WORKDIR /app

# Étape 10 : Copier les fichiers nécessaires pour l'exécution en production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Étape 11 : Exposer le port que l'application utilise
EXPOSE 3000

# Étape 12 : Lancer l'application
CMD ["node", "dist/main"]