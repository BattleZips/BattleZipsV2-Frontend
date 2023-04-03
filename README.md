# BattleZips-Noir Frontend

<p align="center">
  <img width="250" height="250" src="aztec_logo.png">
  <img width="250" height="250" src="battlezips.png">
</p>
<br/>
<br/>

## Description

This repo demonstrates how the proofs for BattleZips-Noir can be generated and verified in a React.js application.

This repo was created with [create-react-app](https://create-react-app.dev/). As of react-scripts 5, core node modules are not automatically polyfilled. Since the Aztec backend packages are native to node, we have to override the configuration to ensure that missing modules do not result in breaking changes. This can be done by ejecting the configuration files or by using a speciazlized npm package to override without ejecting.

Two popular packages used for overriding configuration are [react-app-rewired](https://github.com/timarney/react-app-rewired) and [craco]("https://github.com/dilanx/craco") (create-react-app configuration override). For this implemenation craco was chosen to proceed. Additionally an instrumental piece in getting this frontend implementation to work was the example provided by [hello-noir-ui
](https://github.com/socathie/hello-noir-ui).

## Video Series

Coming soon...

## Get In Touch

Check out the following links to provide feedback or ask questions!

- [Aztec Discord](https://discord.com/channels/563037431604183070/)
- [BattleZips Discord](https://discord.gg/2dkzdDwq)

## Related repositories

- [BattleZips-Noir](https://github.com/BattleZips/BattleZips-Noir)
- [BattleZips Subgraph](https://github.com/BattleZips/battlezip-subgraph)

## Setup

1. Clone repo
   <br/>

```
git clone https://github.com/Ian-Bright/BattleZips-Noir-frontend
```

2. Install dependenices with using npm or yarn

```
yarn
---
npm install
```

3. Copy relevant files over from [BattleZips-Noir](https://github.com/BattleZips/BattleZips-Noir) and paste in public directory

   ##### Web Assembly

   - aztec_backend_bg.wasm
   - barretenberg.wasm
   - noir_wasm_bg.wasm

   ##### Proof related files

   - boardAcir.buf
   - boardCircuit.buf
   - shotAcir.buf
   - shotCircuit.buf

4. Add .env file and add BattleshipGame contract

```
REACT_APP_BATTLESHIP_GAME_CONTRACT_GOERLI=0x867825AF27B113Fa70f01bA716B8E7AB0ac2e9b1
```

5. Start app

```
yarn start
---
npm start
```
# BattleZipsV2-Frontend
