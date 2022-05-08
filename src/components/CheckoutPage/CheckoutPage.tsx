import { ChangeEvent, FormEvent, useState } from "react";

const CheckoutPage = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [creditCardType, setCreditCardType] = useState<string>("");
    const [creditCardNumber, setCreditCardNumber] = useState<string>("");
    const [cvc, setCvc] = useState<string>("");

    const placeOrder = () => {
        console.log(paymentMethod);
        console.log(creditCardType);
        console.log(creditCardNumber);
        console.log(cvc);
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
                                <select name="Credit Card Type" onChange={(evt) => setCreditCardType(evt.target.value)}>
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
                        <div className="row">
                            <div className="col-12"> 
                                <button onClick={() => placeOrder()} className="btn custom-btn">Order</button>
                            </div>
                        </div>
                    </> 
                }
            </div>
        </>
    )
}

export default CheckoutPage;