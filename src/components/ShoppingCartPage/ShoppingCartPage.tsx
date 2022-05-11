import { useContext, useEffect, useState } from "react";
import {apiClient, AuthenticationContext} from "../../App";
import { ShoppingCartItem } from "../utils/ShoppingCartItem";
import "./ShoppingCartPage.css";
import {InputGroup, Label, Radio, RadioGroup} from "@blueprintjs/core";
import {OrderItem, PaymentInformation, PlaceOrderRequest, Purchase} from "../../openapi-client";

const ShoppingCartPage = () => {
    const authenticationContext = useContext(AuthenticationContext);
    let sessionId = authenticationContext.sessionId;
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [creditCardType, setCreditCardType] = useState<string>("MASTERCARD");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");
    const [saleNumber, setSaleNumber] = useState<string>("");

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
        }
        
        calculateTotalPrice();
    }

    const placeOrder = () => {
        let isValidForm: boolean = true;
        if(paymentMethod === "Credit Card") {
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
                alert(result);

                setPaymentMethod("");
                setCreditCardNumber("");
                setCvc("");
            }).catch(response => {
                if (response.status === 403) {
                    alert("Not Authenticated");
                } else if (response.status === 401) {
                    alert("Unauthorized for operation");
                } else if (response.status === 404) {
                    alert("Unknown carrier id");
                } else if (response.status === 400) {
                    alert("Payment information invalid");
                } else {
                    alert("Something went wrong...");
                }
            });
        } else {
            alert("You have to enter the payment information");
        }
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="pageTitle">Shopping Cart</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <table className="table table-hover table-dark">
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
                                        <td>
                                            <input 
                                                type="number"
                                                value={shoppingCartItem.selectedAmount} 
                                                min="1" 
                                                max={shoppingCartItem.amountAvailable}
                                                onChange={(event) => updateSelectedAmount(shoppingCartItem, parseInt(event.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => removeProductFromCart(shoppingCartItem)} className='btn btn-danger'>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>  
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>


                    <div className="row">
                        <div className="col-6">
                            { (authenticationContext.loggedIn && shoppingCart.length > 0) &&
                                <RadioGroup
                                    inline={false}
                                    label="Payment method:"
                                    name="group"
                                    onChange={(evt) => setPaymentMethod(evt.currentTarget.value)}
                                    selectedValue={paymentMethod}
                                >
                                    <Radio {...paymentMethod} label="Credit Card" value="Credit Card" />
                                    <Radio {...paymentMethod} label="Invoice" value="Invoice" />
                                </RadioGroup>
                            }
                        </div>
                        <div className="col-6">
                            <p className="standardText total-price">Total: {totalPrice} €</p>
                        </div>
                    </div>

                {
                    (authenticationContext.loggedIn && paymentMethod === "Credit Card") &&
                    <>
                        <div className="row">
                            <div className="col-12">
                                <label>
                                    Credit card type:
                                </label>
                                <br/>
                                <div className="bp4-html-select">
                                    <select name="Credit Card Type" value={creditCardType} onChange={(evt) => setCreditCardType(evt.target.value)}>
                                        <option value="MASTERCARD">Mastercard</option>
                                        <option value="VISA">Visa</option>
                                    </select>
                                <span className="bp4-icon bp4-icon-double-caret-vertical"></span>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <Label htmlFor="creditCardNumber-input">
                                    Credit card number:
                                </Label>
                                <InputGroup
                                    id="creditCardNumber-input"
                                    value={creditCardNumber}
                                    onInput={(evt) => setCreditCardNumber(evt.currentTarget.value)}
                                    placeholder={"2919181818..."}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <Label htmlFor="cvc-input">
                                    CVC:
                                </Label>
                                <InputGroup
                                    id="cvc-input"
                                    value={cvc}
                                    onInput={(evt) => setCvc(evt.currentTarget.value)}
                                    placeholder={"291..."}
                                />
                            </div>
                        </div>
                    </>
                }
                {
                    (authenticationContext.loggedIn && shoppingCart.length > 0) &&

                    <div className="row">
                        <div className="col-12">
                            <button onClick={() => placeOrder()} className="btn custom-btn">Check out</button>
                        </div>
                    </div>
                }
               
            </div>
        </>
    );
}

export const shoppingCart: ShoppingCartItem[] = [];
export default ShoppingCartPage;


