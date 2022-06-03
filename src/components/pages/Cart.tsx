import React, { useContext, useEffect, useState } from "react";
import {apiClient, AuthenticationContext, ShoppingCartContext} from "../../App";
import { ShoppingCartItem } from "../others/ShoppingCartItem";
import {OrderItem, PaymentInformation, PlaceOrderRequest, Purchase} from "../../openapi-client";
import {FaTrashAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const Cart = () => {
    const shoppingCartContext = useContext(ShoppingCartContext);
    const authenticationContext = useContext(AuthenticationContext);
    const sessionId = authenticationContext.sessionId;

    const [totalPrice, setTotalPrice] = useState<number>(0);

    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [creditCardType, setCreditCardType] = useState<string>("MASTERCARD");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");

    const[displayMessage, setDisplayMessage] = useState<boolean>(false);
    const[messageText, setMessageText] = useState<string>("");
    const[displayAsError, setDisplayAsError] = useState<boolean>(false);


    useEffect(() => {     
        calculateTotalPrice();
    });

    function calculateTotalPrice() {
        let total: number = 0;

        shoppingCart?.forEach((shoppingCartItem) => {
            if(shoppingCartItem.pricePerCarrier !== undefined) {
                total += shoppingCartItem.selectedAmount * shoppingCartItem.pricePerCarrier;
            }
        });

        setTotalPrice(total);
    }

    const updateSelectedAmount = (shoppingCartItem: ShoppingCartItem, newAmount: number) => {
        if(shoppingCartItem !== undefined) {
            let newShoppingCartItem = new ShoppingCartItem(
                shoppingCartItem.productName,
                shoppingCartItem.artistName,
                shoppingCartItem.soundCarrierId,
                shoppingCartItem.soundCarrierType,
                shoppingCartItem.pricePerCarrier,
                shoppingCartItem.amountAvailable,
                newAmount
            );

            let oldItemIndex = shoppingCart.indexOf(shoppingCartItem);
            shoppingCart[oldItemIndex] = newShoppingCartItem;

            calculateTotalPrice();
        }
    }

    const removeProductFromCart = (shoppingCartItem: ShoppingCartItem) => {
        let index = shoppingCart?.indexOf(shoppingCartItem);

        if(index !== -1 && index !== undefined) {
            shoppingCart.splice(index, 1);
            shoppingCartContext.setItems(shoppingCart.length);

        }
        
        calculateTotalPrice();
    }

    const placeOrder = () => {
        setMessageText("");
        setDisplayAsError(false);

        let isValidForm: boolean = true;
        if(paymentMethod === "Credit card") {
            if(creditCardType === "" || creditCardNumber === "" || cvc === "") {
                isValidForm = false;
            }
        }

        //TODO: kredikartendaten prüfen ja/nein?

        if(isValidForm) {
            let providedPaymentInformation: PaymentInformation = {
                paymentMethod: paymentMethod,
                creditCardType: creditCardType,
                creditCardNumber: creditCardNumber,
                cvc: cvc,
            };

            let selectedItems: OrderItem[] = [];
            shoppingCart.forEach((item) => {
                let orderItem: OrderItem = {
                    carrierId: item.soundCarrierId,
                    amount: item.selectedAmount,
                };

                selectedItems.push(orderItem);
            });

            let purchase: Purchase = {
                paymentInformation: providedPaymentInformation,
                orderItems: selectedItems,
            };

            let placeOrderRequest: PlaceOrderRequest = {
                sessionId: sessionId,
                purchase: purchase,
            };

            apiClient.placeOrder(placeOrderRequest).then(() => {
                setPaymentMethod("");
                setCreditCardNumber("");
                setCvc("");
                shoppingCart = [];
                shoppingCartContext.setItems(shoppingCart.length);
                navigate("/orders");
            }).catch(response => {
                setDisplayAsError(true);
                if (response.status === 403) {
                    setMessageText("Not Authenticated");
                } else if (response.status === 401) {
                    setMessageText("Unauthorized for operation");
                } else if (response.status === 404) {
                    setMessageText("Unknown carrier id");
                } else if (response.status === 400) {
                    setMessageText("Payment information invalid");
                } else {
                    setMessageText("Something went wrong...");
                }
            });
        } else {
            setDisplayAsError(true);
            setMessageText("You have to enter the payment information");
        }
    }

    return (
        <div className="content">
            <div className="container h-100 py-5">
                { shoppingCart.length > 0 ?
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Album</th>
                                    <th>Artist</th>
                                    <th>Type</th>
                                    <th className="col-2 text-end pe-4">Unit price</th>
                                    <th style={{width: "120px"}}></th>
                                </tr>
                            </thead>
                            <tbody>
                            { shoppingCart?.map(
                                shoppingCartItem =>
                                    <tr key={shoppingCartItem.soundCarrierId}>
                                        <td className="align-middle">{shoppingCartItem.productName}</td>
                                        <td className="align-middle">{shoppingCartItem.artistName}</td>
                                        <td className="align-middle">{shoppingCartItem.soundCarrierType}</td>
                                        <td className="align-middle text-end pe-5">{shoppingCartItem.pricePerCarrier} €</td>
                                        <td className="align-middle d-flex justify-content-end">
                                            <input
                                                className="form-control small-control me-2"
                                                type="number"
                                                value={shoppingCartItem.selectedAmount}
                                                min="1"
                                                max={shoppingCartItem.amountAvailable}
                                                onChange={(event) => {
                                                    if(shoppingCartItem.amountAvailable !== undefined && parseInt(event.target.value) > shoppingCartItem.amountAvailable) {
                                                        event.target.value = String(shoppingCartItem.amountAvailable);
                                                    }
                                                    updateSelectedAmount(shoppingCartItem, parseInt(event.target.value))
                                                }}
                                            />
                                            <button className="btn btn-danger btn-sm d-flex" onClick={() => removeProductFromCart(shoppingCartItem)}>
                                                <FaTrashAlt className="align-self-center my-1" size={16}></FaTrashAlt>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <div className="row justify-content-between py-3">
                            <div className="col-3 align-self-center">
                                <select className="form-select small-control" onChange={(evt) => setPaymentMethod(evt.currentTarget.value)}>
                                    <option value="Invoice">Invoice</option>
                                    <option value="Credit card">Credit card</option>
                                </select>
                                { paymentMethod === "Credit card" &&
                                    <>
                                        <select className="form-select small-control my-1" value={creditCardType} onChange={(evt) => setCreditCardType(evt.target.value)}>
                                            <option value="MASTERCARD">Mastercard</option>
                                            <option value="VISA">Visa</option>
                                        </select>
                                        <div className="row">
                                            <div className="col">
                                                <input
                                                    className="form-control small-control"
                                                    id="creditCardNumber-input"
                                                    value={creditCardNumber}
                                                    onInput={(evt) => setCreditCardNumber(evt.currentTarget.value)}
                                                    placeholder="Card number"
                                                />
                                            </div>
                                            <div className="col-3">
                                                <input
                                                    className="form-control small-control"
                                                    id="cvc-input"
                                                    value={cvc}
                                                    onInput={(evt) => setCvc(evt.currentTarget.value)}
                                                    placeholder="CVC"
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="col align-self-center text-center">
                                {authenticationContext.loggedIn ?
                                    <span className={ displayAsError ? "fw-bolder error" : "fw-bolder" }>{messageText}</span>
                                    :
                                    <span className="fw-bolder error">You have to login for paying!</span>
                                }
                            </div>
                            <div className="col-2 align-self-center text-end">
                                <span>Total price<br/><span className="fw-bolder">{totalPrice} €</span></span>
                                <div>
                                    { authenticationContext.loggedIn && <button onClick={() => placeOrder()} className="btn btn-s btn-sm my-3">Check out</button> }
                                </div>
                            </div>
                        </div>
                    </>
                :
                    <div className="row justify-content-center" style={{"height": "20%"}}>
                        <h4 className="align-self-center text-center">Cart is empty!</h4>
                    </div>
                }
            </div>
        </div>
    );
}

export let shoppingCart: ShoppingCartItem[] = [];
export default Cart;