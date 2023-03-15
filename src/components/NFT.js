import React, { useState } from 'react'
import css from "../styles/NFT.module.css"
import { Button, Modal } from 'react-bootstrap'

function NFT({ src, buy }) {

    const [isBought, setisBought] = useState(false)
    const [txSuccess, settxSuccess] = useState()

    async function handleBuy() {
        let result = await buy();
        if (result) {
            setisBought(true)
            settxSuccess(true)
        }
        else {
            settxSuccess(false)
        }
    }


    return (
        <div className={isBought ? css.sold : css.NFT}>

            <Modal show={txSuccess === false} onHide={() => { settxSuccess("") }}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Something went wrong</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Failed to process the transaction!
                        <br />
                        Try refreshing the page and connecting your wallet again!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { settxSuccess("") }} variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>

            <header style={{ textAlign: "center" }}> {`Ape #${Math.floor(Math.random() * 10000)}`}</header>
            <img src={src} alt={"loading.."} style={{ height: "13rem" }} className={css.NFT} />
            {
                isBought ?
                    <div style={{ fontSize: "1.5rem", textAlign: "center", backgroundColor: "green" }}>Sold !</div> :
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "1.3rem", textAlign: "left" }}>
                            Price : 1 ALGO
                        </span>
                        <Button onClick={handleBuy}>Buy</Button>
                    </div>
            }
        </div>
    )
}

export default NFT