import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { apiClient, AuthenticationContext } from "../../App";
import { OrderItem, PaymentInformation, PlaceOrderRequest, Purchase } from "../../openapi-client";
import { shoppingCart } from "../ShoppingCartPage/ShoppingCartPage";

const CheckoutPage = () => {
    const authenticationContext = useContext(AuthenticationContext);
    let sessionId = authenticationContext.sessionId;
    
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [creditCardType, setCreditCardType] = useState<string>("MASTERCARD");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");
    const [saleNumber, setSaleNumber] = useState<string>("");

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
            }).catch(reason => {
                //TODO handling
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
                        <h1 className="pageTitle">Check out</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="standardText">Payment Method:</p>
                    </div>
                    <div className="col-12">
                        <input onChange={(evt) => setPaymentMethod(evt.target.value)} type="radio" value="Credit Card" name="paymentMethod" /> Credit Card
                        <br />
                        <input onChange={(evt) => setPaymentMethod(evt.target.value)} type="radio" value="Invoice" name="paymentMethod" /> Invoice
                    </div>
                </div>
                {
                    paymentMethod === "Credit Card" &&
                    <>
                        <div className="row">
                            <div className="col-12"> 
                                <select name="Credit Card Type" value={creditCardType} onChange={(evt) => setCreditCardType(evt.target.value)}>
                                    <option value="MASTERCARD">Mastercard</option>
                                    <option value="VISA">Visa</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12"> 
                                <input type="text" placeholder="Credit Card number" onChange={(evt) => setCreditCardNumber(evt.target.value)}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12"> 
                                <input type="text" placeholder="CVC" onChange={(evt) => setCvc(evt.target.value)}/>
                            </div>
                        </div>
                    </> 
                }
                <div className="row">
                    <div className="col-12"> 
                        <button onClick={() => placeOrder()} className="btn custom-btn">Order</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;