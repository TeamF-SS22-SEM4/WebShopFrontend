import React, { useContext, useEffect, useState } from "react";
import {apiClient, AuthenticationContext, ShoppingCartContext} from "../../App";
import { ShoppingCartItem } from "../others/ShoppingCartItem";
import {OrderItem, PaymentInformation, PlaceOrderRequest, Purchase} from "../../openapi-client";
import {FaTrashAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

let text = " ";

const CartPage = () => {
    const shoppingCartContext = useContext(ShoppingCartContext);
    const authenticationContext = useContext(AuthenticationContext);
    const sessionId = authenticationContext.sessionId;
    const navigate = useNavigate();

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>("Credit card");
    const [creditCardType, setCreditCardType] = useState<string>("MASTERCARD");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");

    const[messageText, setMessageText] = useState<string>("");

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

    function updateSelectedAmount(shoppingCartItem: ShoppingCartItem, newAmount: number) {
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

    function removeProductFromCart(shoppingCartItem: ShoppingCartItem) {
        let index = shoppingCart?.indexOf(shoppingCartItem);

        if(index !== -1 && index !== undefined) {
            shoppingCart.splice(index, 1);
            shoppingCartContext.setItems(shoppingCart.length);

        }
        calculateTotalPrice();
    }

    function placeOrder() {
        text = text + " ";
        setMessageText("");

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
                navigate("/purchases");
            }).catch(response => {
                if (response.status === 403) {
                    setMessageText("Not Authenticated!" + text);
                } else if (response.status === 401) {
                    setMessageText("Unauthorized for operation!" + text);
                } else if (response.status === 404) {
                    setMessageText("Unknown carrier id!" + text);
                } else if (response.status === 400) {
                    setMessageText("Payment information invalid!" + text);
                } else {
                    setMessageText("Something went wrong!" + text);
                }
            });
        } else {
            setMessageText("You have to enter the payment information!" + text);
        }
    }

    //TODO: Feedback wenn Item nicht mehr verfügbar?
    //TODO: Kreditkartendaten werden nicht geprüft?!

    return (
        <div className="content">
            <div className="container h-100 pt-5 pb-4">
                { shoppingCart.length > 0 ?
                    <>
                        <div className="table-wrapper" style={{maxHeight: "85%"}}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="py-4">Album</th>
                                        <th className="py-4">Artist</th>
                                        <th className="py-4">Type</th>
                                        <th className="py-4 col-2 text-end pe-4">Unit price</th>
                                        <th className="py-4" style={{width: "120px"}}></th>
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
                        </div>
                        <div className="row pt-3 px-3" style={{maxHeight: "15%"}}>
                            <div className="col-3 pt-2">
                                <select className="form-select small-control" onChange={(evt) => setPaymentMethod(evt.currentTarget.value)}>
                                    <option value="Credit card">Credit card</option>
                                    <option value="Invoice">Invoice</option>
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
                                <p key={messageText} style={{margin: 0}} className={authenticationContext.loggedIn ? "fw-bolder error breath-animation" : "fw-bolder error"}>{authenticationContext.loggedIn ? messageText : "You have to login for paying!"}</p>
                            </div>
                            <div className="col-2 row text-end">
                                <span className="align-self-start">Total price<br/><span className="fw-bolder">{totalPrice} €</span></span>
                                <div className="align-self-end">
                                    { authenticationContext.loggedIn && <button onClick={() => placeOrder()} className="btn btn-s btn-sm mt-2">Check out</button> }
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
export default CartPage;