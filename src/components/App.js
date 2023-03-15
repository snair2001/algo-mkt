import "bootstrap/dist/css/bootstrap.min.css"
import NFT from "./NFT";
import css from "../styles/NFT.module.css"
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import algosdk from "algosdk"
import MyAlgoConnect from '@randlabs/myalgo-connect';
window.Buffer = require("buffer").Buffer

let myAlgoConnect;
let algodClient;
let txnParams;


function App() {

  const [activeAcc, setactiveAcc] = useState(null)
  let paths = []

  for (let i = 1; i <= 5; i++) {
    paths.push(require(`../images/${i}.jpg`))
  }

  useEffect(() => {
    async function main() {
      myAlgoConnect = new MyAlgoConnect()
      algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');
      txnParams = await algodClient.getTransactionParams().do()
    }

    main()

  }, [])

  async function buy() {
    if (!activeAcc) return

    try {
      const unsignedTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: activeAcc,
        total: 1,
        decimals: 0,
        assetName: "IGNITUS NFT",
        unitName: "IGNI-NFT",
        assetURL: "",
        assetMetadataHash: "",
        defaultFrozen: false,
        freeze: undefined,
        manager: activeAcc,
        clawback: undefined,
        reserve: undefined,
        suggestedParams: txnParams,
      });

      const signedTxn = await myAlgoConnect.signTransaction(unsignedTxn.toByte());

      const response = await algodClient.sendRawTransaction(signedTxn.blob).do();

      console.log(response);
      return true;

    } catch (e) {
      console.log(e);
      return false;
    }

  }

  async function connectWallet() {
    const res = await myAlgoConnect.connect()
    setactiveAcc(res[0].address);
  }


  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "space-between", }}>

        <h1 style={{ textAlign: "center", paddingTop: "1rem" }}>The NFT marketplace</h1>
        {
          activeAcc == null ?
            <Button style={{ margin: "1rem" }} onClick={connectWallet}>Connect Wallet</Button>
            :
            <div style={{ fontSize: "larger", margin: "1rem", backgroundColor: "rgba(0, 0, 0, 0.488)", minHeight: "3rem", minWidth: "20rem", display: "flex", alignItems: "center", justifyContent: "center", color: "black" }}>
              Account ID : <span>{activeAcc.slice(0, 10)}.....</span>
            </div>
        }
      </div>
      <div className={css.wrapper}>
        {
          paths.map((img, i) => {
            return <NFT src={img} buy={buy} key={i} />
          })
        }
      </div>

    </div>
  );
}

export default App;
