import {useContext, useState} from 'react';
import {ProductDetailsDTO, SoundCarrierDTO} from "../../openapi-client";
import {ShoppingCartItem} from "./ShoppingCartItem";
import {shoppingCart} from "../pages/Cart";
import {ShoppingCartContext} from "../../App";

interface BuyProductPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined;
}

const BuyProductPopup = ({callbackFunction, product}: BuyProductPopupProps) => {
    const[selectedSoundCarriers, setSelectedSoundCarriers] = useState<Map<SoundCarrierDTO, number>>(new Map());
    const shoppingCartContext = useContext(ShoppingCartContext);

    const[displayMessage, setDisplayMessage] = useState<boolean>(false);
    const[messageText, setMessageText] = useState<string>("");


    const updateSelectedSoundCarriers = (soundCarrier: SoundCarrierDTO, amount: number) => {
        let temp = selectedSoundCarriers;
        temp.set(soundCarrier, amount)
        setSelectedSoundCarriers(temp);
    }

    const addToCart = () => {
        // Calc sum of selected amount because the amount of every product could be 0
        let sumOfSelectedAmount: number = 0;

        selectedSoundCarriers.forEach((amount) => {
            sumOfSelectedAmount += amount;
        });

        if(selectedSoundCarriers.size === 0 || sumOfSelectedAmount === 0) {
            setMessageText("Failed - You have to choose at least one item!");
            setDisplayMessage(true);
        } else {
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

                        // Should set amount to 0 so the ui refreshes the table and shows 0
                        // TODO: Fix this
                        updateSelectedSoundCarriers(selectedSoundCarrier, 0);

                        setMessageText("Success - Your article(s) are now in the shopping cart!");
                        setDisplayMessage(true);
                    } else {
                        setMessageText("Failed - This product(s) are already in the cart!");
                        setDisplayMessage(true);
                    }
                }
            });
        }
    }

    return (
        <div className='modal-outer'>

            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{product?.name}</h5>
                        <button className="btn btn-primary btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-hover table-dark custom-table">
                            <thead className="custom-table-head">
                            <tr>
                                <th>Type</th>
                                <th>Available</th>
                                <th>Price</th>
                                <th>Selected Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                product?.soundCarriers?.map(
                                    soundCarrier =>
                                        <tr key={soundCarrier.soundCarrierId}>
                                            <td className="align-middle">{soundCarrier.soundCarrierName}</td>
                                            <td className="align-middle">{soundCarrier.amountAvailable}</td>
                                            <td className="align-middle">{soundCarrier.pricePerCarrier}€</td>
                                            <td className="align-middle">
                                                <input
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
                    </div>
                    <div className="modal-footer justify-content-between">
                        <p>{!displayMessage ? "" : <>{messageText}</>}</p>
                        <button className="btn btn-success btn-sm" onClick={() => addToCart()}>Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyProductPopup;