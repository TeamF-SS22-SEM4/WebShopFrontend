import React, {useContext, useState} from 'react';
import {ProductDetailsDTO, SoundCarrierDTO} from "../../openapi-client";
import {ShoppingCartItem} from "../others/ShoppingCartItem";
import {shoppingCart} from "../pages/Cart";
import {ShoppingCartContext} from "../../App";

interface BuyModalProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined;
    isLoading: boolean;
}

let text = " ";

const BuyModal = ({callbackFunction, product, isLoading}: BuyModalProps) => {

    const shoppingCartContext = useContext(ShoppingCartContext);

    const[selectedSoundCarriers, setSelectedSoundCarriers] = useState<Map<SoundCarrierDTO, number>>(new Map());
    const[messageText, setMessageText] = useState<string>("");
    const[displayMessage, setDisplayMessage] = useState<boolean>(false);

    function updateSelectedSoundCarriers(soundCarrier: SoundCarrierDTO, amount: number) {
        let temp = selectedSoundCarriers;
        temp.set(soundCarrier, amount)
        setSelectedSoundCarriers(temp);
    }

    function addToCart() {
        text = text + " ";
        setMessageText("");
        setDisplayMessage(false);

        let sumOfSelectedAmount: number = 0;
        selectedSoundCarriers.forEach((amount) => {
            sumOfSelectedAmount += amount;
        });

        if(selectedSoundCarriers.size === 0 || sumOfSelectedAmount === 0) {
            setMessageText("Failed - You have to choose at least one item!" + text);
            setDisplayMessage(true);
        } else {
            let productAlreadyInCart: boolean = false;

            selectedSoundCarriers.forEach((amount, selectedSoundCarrier) => {
                if(shoppingCart.findIndex(item => item.soundCarrerId === selectedSoundCarrier.soundCarrierId) !== -1 && amount > 0) {
                    productAlreadyInCart = true;
                }
            })

            if (!productAlreadyInCart) {
                selectedSoundCarriers.forEach((amount, selectedSoundCarrier) => {
                    if(amount !== 0) {
                        let shoppingCartItem = new ShoppingCartItem(
                            product?.name,
                            product?.artistName,
                            selectedSoundCarrier.soundCarrierId,
                            selectedSoundCarrier.soundCarrierName,
                            selectedSoundCarrier.pricePerCarrier,
                            selectedSoundCarrier.amountAvailable,
                            amount
                        );

                        if(shoppingCart.findIndex(item => item.soundCarrerId === shoppingCartItem.soundCarrerId) === -1) {
                            shoppingCart.push(shoppingCartItem);
                            shoppingCartContext.setItems(shoppingCart.length);
                            callbackFunction();
                        }
                    }
                });
            } else {
                setMessageText("Failed - Some of the product(s) are already in the cart!" + text);
                setDisplayMessage(true);
            }
        }
    }

    return (
        <div className='modal-outer'>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{!isLoading && product?.name}</h5>
                        <button className="btn btn-p btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        { !isLoading ?
                            <table className="table">
                                <thead className="">
                                    <tr>
                                        <th>Type</th>
                                        <th>Available</th>
                                        <th>Price</th>
                                        <th style={{width: "80px"}}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                { product?.soundCarriers?.map(
                                    soundCarrier =>
                                        <tr key={soundCarrier.soundCarrierId}>
                                            <td className="align-middle">{soundCarrier.soundCarrierName}</td>
                                            <td className="align-middle">{soundCarrier.amountAvailable}</td>
                                            <td className="align-middle">{soundCarrier.pricePerCarrier}€</td>
                                            <td className="align-middle">
                                                <input
                                                    className="form-control small-control"
                                                    type="number"
                                                    placeholder='0'
                                                    min="0"
                                                    max={soundCarrier.amountAvailable}
                                                    onChange={(event) => {
                                                        if (soundCarrier.amountAvailable !== undefined && parseInt(event.target.value) > soundCarrier.amountAvailable) {
                                                            event.target.value = String(soundCarrier.amountAvailable);
                                                        }
                                                        updateSelectedSoundCarriers(soundCarrier, parseInt(event.target.value))
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        :
                            <div className="row justify-content-center py-5">
                                <div className="spinner-border align-self-center"></div>
                            </div>
                        }
                    </div>
                    { !isLoading &&
                        <div className="modal-footer justify-content-between">
                            <p key={messageText} className="fw-bolder test error">{!displayMessage ? "" : <>{messageText}</>}</p>
                            <button className="btn btn-success btn-sm" onClick={() => addToCart()}>Add to cart</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default BuyModal;