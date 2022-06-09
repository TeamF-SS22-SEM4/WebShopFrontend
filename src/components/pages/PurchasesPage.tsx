import React, {useContext, useEffect, useState} from "react";
import {GetPurchaseHistoryRequest, SaleDTO} from "../../openapi-client";
import {apiClient, AuthenticationContext} from "../../App";

const PurchasesPage = () => {

    let authContext = useContext(AuthenticationContext)
    const [purchases, setPurchases] = useState<SaleDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = () => {
        setIsLoading(true);

        let getPurchaseHistoryRequest: GetPurchaseHistoryRequest = {
            sessionId: authContext.sessionId
        }

        apiClient.getPurchaseHistory(getPurchaseHistoryRequest).then(result => {
            setIsLoading(false);
            setPurchases(result);
        }).catch(response => {
            // TODO: Visual feedback
            if(response.status === 401) {
                console.log("Not Authorized");
            } else if(response.status === 403) {
                console.log("Not Authenticated");
            } else if(response.status === 404) {
                console.log("User not found");
            }
        });
    }

    return (
        <div className="content">
            <div className="container h-100 py-5">
                <h4 className="mb-3">Purchases</h4>
                {purchases.length === 0 ?
                    <div className="row justify-content-center h-25">
                        <span className="h4 text-center m-auto">No purchases found!</span>
                    </div>
                :
                    <>
                        {isLoading ?
                            <div className="row justify-content-center h-25">
                                <div className="spinner-border align-self-center"></div>
                            </div>
                        :
                            <div className="accordion pb-5">
                                {
                                    purchases.map((purchase, index) =>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className={index === 0 ? "accordion-button" : "accordion-button collapsed"} data-bs-toggle="collapse" data-bs-target={"#a" + (index + 1)} aria-expanded="false">
                                                    <div className="col fw-bolder">
                                                        {purchase.invoiceNumber}
                                                    </div>
                                                    <div className="col fw-bolder text-center">
                                                        {purchase.dateOfSale}
                                                    </div>
                                                    <div className="col fw-bolder text-end">
                                                        {purchase.totalPrice} €&nbsp;&nbsp;&nbsp;
                                                    </div>
                                                </button>
                                            </h2>
                                            <div id={"a" + (index + 1)} className={index === 0 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                                <div className="accordion-body">
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th className="col">Album</th>
                                                            <th className="col">Artist</th>
                                                            <th className="col">Type</th>
                                                            <th className="col-1 text-center">Amount</th>
                                                            <th className="col-1 text-end">Unit price</th>
                                                            <th className="col-1 text-end">Price</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            purchase.saleItems?.map(saleItem =>
                                                                <tr key={saleItem.soundCarrierId}>
                                                                    <td className="align-middle">{saleItem.productName}</td>
                                                                    <td className="align-middle">{saleItem.artistName}</td>
                                                                    <td className="align-middle">{saleItem.soundCarrierName}</td>
                                                                    <td className="align-middle text-center">{saleItem.amountOfCarriers}</td>
                                                                    <td className="align-middle text-end">{saleItem.pricePerCarrier} €</td>
                                                                    <td className="align-middle text-end">
                                                                        {
                                                                            (saleItem.pricePerCarrier !== undefined && saleItem.amountOfCarriers !== undefined)
                                                                            &&
                                                                            saleItem.pricePerCarrier * saleItem.amountOfCarriers
                                                                        } €
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default PurchasesPage;