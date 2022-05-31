import {ProductDetailsDTO} from "../../openapi-client";
import React from "react";

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined
    isLoading: boolean;
}

const ProductDetailsPopup = ({callbackFunction, product, isLoading}: ProductDetailsPopupProps) => {

    return (
        <div className='modal-outer'>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{!isLoading && product?.name}</h5>
                        <button className="btn btn-primary btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        {!isLoading ?
                            <>
                                <p>Album {product?.artistName}</p>
                                <p>Artist {product?.genre}</p>
                                <p>Genre {product?.releaseYear}</p>
                                <p>Release {product?.duration}</p>
                                <p>Label {product?.labelName}</p>
                                <table className="table">
                                    <thead className="custom-table-head">
                                    <tr>
                                        <th>Title</th>
                                        <th>Duration</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        product?.songs?.map(
                                            song =>
                                                <tr>
                                                    <td className="align-middle">{song.title}</td>
                                                    <td className="align-middle">{song.duration}</td>
                                                </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </>
                            :
                            <div className="row justify-content-center py-5">
                                <div className="spinner-border align-self-center"></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPopup;