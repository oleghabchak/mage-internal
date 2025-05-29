# Mage App

This project is a mobile workout application built with React Native and Expo.

## Installation

Before getting started, make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (recommended LTS version)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Steps to Install

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone git@github.com:KevychSolutions/mage-app.git

   ```

2. **Navigate to the Project Directory**

   Change into the project directory:

   ```bash
   cd workout-app

   ```

3. **Install Dependencies**
   Install the required dependencies using Yarn or npm:

   ```bash
   yarn install
➜   cd ios && pod deintegrate && pod install && cd ..
   ```

4. **Start the Expo Server**
   Start the Expo development server:

   ```bash
   expo start

   ```

   This command will open a new browser window where you can use the Expo DevTools to run the app on an emulator or a physical device.

## Running the App

To run the app on your device, follow these steps:

### On Android:

1. Install the Expo Go app from the Google Play Store.
2. Scan the QR code displayed in the terminal or the Expo DevTools.

### On iOS:

1. Install the Expo Go app from the App Store.
2. Scan the QR code displayed in the terminal or the Expo DevTools.

## Troubleshooting

If you encounter any issues during installation or while running the app, here are some common solutions:

- **Node version issues:** Make sure you are using the recommended version of Node.js. You can use tools like `nvm` (Node Version Manager) to manage your Node.js versions.
- **Dependencies not installing:** Run `yarn install` or `npm install` again. Sometimes, clearing the cache helps: `yarn cache clean` or `npm cache clean --force`.
- **Expo not starting:** Make sure Expo CLI is installed globally by running `npm install -g expo-cli` or `yarn global add expo-cli`.
- **Network issues:** Ensure your device and computer are on the same network if you are testing on a physical device.

For more information, refer to the [Expo documentation](https://docs.expo.dev/) or the [React Native documentation](https://reactnative.dev/docs/getting-started).
