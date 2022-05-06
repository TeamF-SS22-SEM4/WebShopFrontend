import { useState } from 'react';
import { ProductDetailsDTO } from '../../openapi-client';
import './SearchPage.css';

interface BuyProductPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined;
}

const BuyProductPopup = ({callbackFunction, product}: BuyProductPopupProps) => {
    const[selectedAmounts, setSelectedAmounts] = useState<Map<string | undefined, number>>(new Map());

    const updateSelectedAmounts = (soundCarrierId: string | undefined, amount: number) => {
        let tempSelectedAmounts = selectedAmounts;
        tempSelectedAmounts.set(soundCarrierId, amount)
        setSelectedAmounts(tempSelectedAmounts);
    }

    const addToCart = () => {
        // TODO: When implementing cart build product with carrierId, productName etc.
        console.log(selectedAmounts);
    }
    
    return (
        <div className='popup'>
            <div className='popup_inner'>
                <div className="container">
                    <div className="row header">
                        <div className="col-10">
                            <h1>{product?.name}</h1>
                        </div>
                        <div className="col-2">
                            <button onClick={() => callbackFunction()}>Close</button>
                        </div>
                    </div>
                    <div className="row flex-grow-1 content">
                        <div className="col-10">
                            <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Available</th>
                                            <th>Price</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            product?.soundCarriers?.map(
                                                soundCarrier =>
                                                    <tr key={soundCarrier.soundCarrierId}>
                                                        <td className="align-middle">{soundCarrier.soundCarrierName}</td>
                                                        <td className="align-middle">{soundCarrier.amountAvailable}</td>
                                                        <td className="align-middle">{soundCarrier.pricePerCarrier}</td>
                                                        <td className="align-middle">
                                                            <input 
                                                                type="number" 
                                                                placeholder='0'
                                                                value={selectedAmounts.get(soundCarrier.soundCarrierId)} 
                                                                min="0" 
                                                                max={soundCarrier.amountAvailable}
                                                                onChange={(event) => updateSelectedAmounts(soundCarrier.soundCarrierId, parseInt(event.target.value))}
                                                            />
                                                        </td>
                                                        <td className="align-middle">
                                                            <button onClick={() => addToCart()}> 
                                                                Add to cart 
                                                            </button>
                                                        </td>
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

export default BuyProductPopup;