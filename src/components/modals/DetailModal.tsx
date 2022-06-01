import {ProductDetailsDTO} from "../../openapi-client";
import React from "react";

interface DetailModalProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined
    isLoading: boolean;
}

const DetailModal = ({callbackFunction, product, isLoading}: DetailModalProps) => {

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
                            <>
                                <table className="table mb-5">
                                    <thead>
                                        <tr>
                                            <th>Album</th>
                                            <th>Artist</th>
                                            <th>Genre</th>
                                            <th>Release</th>
                                            <th>Duration</th>
                                            <th>Label</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="align-middle">{product?.name}</td>
                                            <td className="align-middle">{product?.artistName}</td>
                                            <td className="align-middle">{product?.genre}</td>
                                            <td className="align-middle">{product?.releaseYear}</td>
                                            <td className="align-middle">{product?.duration}</td>
                                            <td className="align-middle">{product?.labelName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th className="text-center">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { product?.songs?.map(
                                        song =>
                                            <tr>
                                                <td className="align-middle">{song.title}</td>
                                                <td className="align-middle text-center">{song.duration}</td>
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

export default DetailModal;