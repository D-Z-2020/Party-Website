# COMPSCI 732 Project - MSc in Partying
**Party like a pro: 
Groove and share memories with the ultimate platform for hosts and guests!**

## Features
- __Music Sharing__: Sync your party with the perfect playlist. Our platform lets everyone search for their favorite music and add it to the host's playlist.
- __Game Playing__: Infuse your party with interactive fun. Everyone can contribute to the fun by adding external game links and watch the friendly competition unfold.
- __Photo Sharing__: Capture the moment and share them instantly. Our platform allows everyone to capture photos and upload them to a shared album.
- __Party Space__: Create your personalized party space that combines music sharing, games playing, and photos sharing features all in one place. Customize your party space with a name, set the time, and even denote a virtual or real-world location.

## Installation
Before you begin, ensure you have installed the latest version of Node.js, npm and MongoDB server on your local development environment. Follow the instruction beblow to run the app:

1. Clone the project repository from GitHub:
    ```bash
    git clone https://github.com/UOA-CS732-SE750-Students-2023/project-group-fluffy-fireflies
    ```
2. Add a `.env` file under `backend` folder with the following information:
    ```bash
    REDIRECT_URI = 'http://localhost:3000/start/'
    CLIENT_ID = '{yourSpotifyClientID}'
    CLIENT_SECRET = '{yourSpotifyClientSecret}'
    TOKEN_SECRET = {yourSerectToken}
    DATABASE_URI = mongodb://127.0.0.1/party
    PORT = 3001
    ```

    For testing purpose, you can use this in your `.env` file:
    ```
    REDIRECT_URI = 'http://localhost:3000/start/'
    CLIENT_ID = '5c9e849201d24dfb8f563a7a081e3be9'
    CLIENT_SECRET = 'b89442d691704f9daddf68ed70f3c9f0'
    TOKEN_SECRET = 0499f5b7ae0e13f94d3866c21b028ecfbd0ca7d724fd6ed942c5c2a492ffb023017b1782e6f461a17aece6cf6254cb4588812dc04caeb9a9a73eb9cdecd7fda9
    DATABASE_URI = mongodb://127.0.0.1/party
    PORT = 3001
    ```
3. If you use your own Spotify Client ID in Step 2, please replace clientId: `5c9e849201d24dfb8f563a7a081e3be9` in `Dashboard.js` with your own client id.
4. In the `backend ` folder, install dependencies:
    ``` 
    npm install
    ```
    And then start the server:
    ```
    npm run devStart
    ```
    You should see
    `Listening on port 3001` in the terminal window.
5. In the `frontend` folder, install dependencies:
    ```
    npm install
    ```
    And then start the application:
    ```
    npm run start
    ```
    You should see the application running under `localhost:3000`.
## Usage
- If you are a party host, you will:
    - Register on the website
    - Choose your role as a `host`
    - Login with your Spotify account (You must have a Spotify Premium account)
    - Add your party name,time and location
    - Enter your party space
    - Distribute the 4-Digit Party Room Code to your guests
    - Wait for others to join your party space
- If you are a guest, you will:
    - Register on the website
    - Choose your role as a `guest`
    - Enter the 4-Digit Party Room Code that the host gives to you
    - Enter the party space and enjoy sharing the music, game and photos

## Group members
- Ting-Ying Wang (twan108): Project Manager and Frontend Developer
- Zushuai(Derek) Zhang (zzha248): Backend Developer
- Shitong Hua (shua445): Frontend Developer
- Jiaqi Luo (jluo396): Designer and Frontend Developer
- Hao Zhong (hzho561): Frontend Developer

## Resources
- [Meeting Minutes](https://github.com/UOA-CS732-SE750-Students-2023/project-group-fluffy-fireflies/wiki)
- [Project Board](https://github.com/orgs/UOA-CS732-SE750-Students-2023/projects/2)
- [User flow and DB schema](https://www.figma.com/file/QgjHye66DRs40dctD8kytG/Diagrams?node-id=0%3A1&t=A0IS9Xn3id1w5ojU-1)
- [UI Prototype](https://www.figma.com/proto/lCqCkMpeoR4nPByI7xLLVb/Website-Wireframes?node-id=1639-201&scaling=scale-down&page-id=1401:1984&starting-point-node-id=1639:201&show-proto-sidebar=1)