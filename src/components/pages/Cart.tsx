import React, { useContext, useEffect, useState } from "react";
import {apiClient, AuthenticationContext, ShoppingCartContext} from "../../App";
import { ShoppingCartItem } from "../others/ShoppingCartItem";
import {OrderItem, PaymentInformation, PlaceOrderRequest, Purchase} from "../../openapi-client";
import {Link} from "react-router-dom";

const Cart = () => {
    const authenticationContext = useContext(AuthenticationContext);
    let sessionId = authenticationContext.sessionId;
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [creditCardType, setCreditCardType] = useState<string>("MASTERCARD");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");
    const [saleNumber, setSaleNumber] = useState<string>("");
    const shoppingCartContext = useContext(ShoppingCartContext);


    const[displayMessage, setDisplayMessage] = useState<boolean>(false);
    const[messageText, setMessageText] = useState<string>("");
    const[displayAsError, setDisplayAsError] = useState<boolean>(false);


    useEffect(() => {     
        calculateTotalPrice();
    });

    const calculateTotalPrice = () => {
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
                shoppingCartItem.soundCarrerId,
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
        setDisplayAsError(false);

        let isValidForm: boolean = true;
        if(paymentMethod === "Credit card") {
            if(creditCardType === "" || creditCardNumber === "" || cvc === "") {
                isValidForm = false;
            }
        }

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
                    carrierId: item.soundCarrerId,
                    amount: item.selectedAmount,
                };

                console.log(item.soundCarrerId);

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

            apiClient.placeOrder(placeOrderRequest).then(result => {
                setMessageText(result);

                setPaymentMethod("");
                setCreditCardNumber("");
                setCvc("");
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
            setMessageText("You have to enter the payment information");
        }
    }

    return (
        <div className="content">
            <div className="container h-100 py-5">
                { shoppingCart.length > 0 ?
                    <>
                        <div className="h-100">
                        <div className="tableContainer d-flex flex-column">
                            <table className="table flex-grow-1">
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Artist</th>
                                    <th>Sound Carrier</th>
                                    <th>Price per Carrier</th>
                                    <th>Selected Amount</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    shoppingCart?.map(
                                        shoppingCartItem =>
                                            <tr key={shoppingCartItem.soundCarrerId}>
                                                <td className="align-middle">{shoppingCartItem.productName}</td>
                                                <td className="align-middle">{shoppingCartItem.artistName}</td>
                                                <td className="align-middle">{shoppingCartItem.soundCarrierType}</td>
                                                <td className="align-middle">{shoppingCartItem.pricePerCarrier} €</td>
                                                <td className="align-middle col-1">
                                                    <input
                                                        //TODO spinner problem
                                                        className="form-control"
                                                        type="number"
                                                        value={shoppingCartItem.selectedAmount}
                                                        min="1"
                                                        max={shoppingCartItem.amountAvailable}
                                                        onChange={(event) => updateSelectedAmount(shoppingCartItem, parseInt(event.target.value))}
                                                    />
                                                </td>
                                                <td className="align-middle">
                                                    <button className="btn btn-danger btn-sm" onClick={() => removeProductFromCart(shoppingCartItem)}>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="row justify-content-between py-3">
                            <div className="col-3">
                                <select className="form-select" onChange={(evt) => setPaymentMethod(evt.currentTarget.value)}>
                                    <option value="Invoice">Invoice</option>
                                    <option value="Credit card">Credit card</option>
                                </select>
                                { paymentMethod === "Credit card" &&
                                    <>
                                        <select className="form-select my-1" value={creditCardType} onChange={(evt) => setCreditCardType(evt.target.value)}>
                                            <option value="MASTERCARD">Mastercard</option>
                                            <option value="VISA">Visa</option>
                                        </select>
                                        <div className="row">
                                            <div className="col">
                                                <input
                                                    className="form-control"
                                                    id="creditCardNumber-input"
                                                    value={creditCardNumber}
                                                    onInput={(evt) => setCreditCardNumber(evt.currentTarget.value)}
                                                    placeholder="Card number"
                                                />
                                            </div>
                                            <div className="col-3">
                                                <input
                                                    className="form-control"
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
                            <div className="col text-end d-flex flex-column">
                                <p className="flex-grow-1">Total price<br/>{totalPrice} €</p>
                                <div>
                                    {authenticationContext.loggedIn ?
                                        <>
                                        <span className="pe-3">{messageText}</span>
                                        <button onClick={() => placeOrder()} className="btn btn-success">Check out</button>
                                        </>
                                        :
                                        <span>log in!</span>
                                    }
                                </div>
                            </div>
                        </div>
                        </div>
                    </>
                :
                    <div className="row justify-content-center" style={{"height": "20%"}}>
                        <h5 className="align-self-center text-center">Cart is empty!</h5>
                    </div>
                }
            </div>
        </div>
    );
}

export const shoppingCart: ShoppingCartItem[] = [];
export default Cart;