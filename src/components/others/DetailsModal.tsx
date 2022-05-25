import {ProductDetailsDTO} from "../../openapi-client";

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined
}

const ProductDetailsPopup = ({callbackFunction, product}: ProductDetailsPopupProps) => {



    return (
        <div className='modal-outer'>


            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{product?.name}</h5>
                        <button className="btn btn-primary btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        <p>Album {product?.artistName}</p>
                        <p>Artist {product?.genre}</p>
                        <p>Genre {product?.releaseYear}</p>
                        <p>Release {product?.duration}</p>
                        <p>Label {product?.labelName}</p>
                        <table className="table table-hover table-dark custom-table">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPopup;