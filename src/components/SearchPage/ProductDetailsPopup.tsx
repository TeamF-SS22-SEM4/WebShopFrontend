import { ProductDetailsDTO } from '../../openapi-client';

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined
}

const ProductDetailsPopup = ({callbackFunction, product}: ProductDetailsPopupProps) => {
    
    return (
        <div className='popup'>
            <div className='popup_inner'>
                <div className="container">
                    <div className="row header">
                        <div className="col-10">
                            <h1>{product?.name}</h1>
                        </div>
                        <div className="col-2">
                            <button className="btn custom-btn close-btn" onClick={() => callbackFunction()}>Close</button>
                        </div>
                    </div>
                    <div className="row flex-grow-1 content">
                        <div className="col-6">
                            <p>Album {product?.artistName}</p>
                            <p>Artist {product?.genre}</p>
                            <p>Genre {product?.releaseYear}</p>
                            <p>Release {product?.duration}</p>
                            <p>Label {product?.labelName}</p>
                        </div>
                        <div className="col-6">
                            <table className="table table-hover table-dark">
                                <thead>
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
      </div>
    )
}

export default ProductDetailsPopup;