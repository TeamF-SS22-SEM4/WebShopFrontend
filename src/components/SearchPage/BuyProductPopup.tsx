import { useState } from 'react';
import { ProductDetailsDTO, SoundCarrierDTO } from '../../openapi-client';
import './SearchPage.css';
import { ShoppingCartItem, shoppingCart } from '../ShoppingCartPage/ShoppingCartPage';

interface BuyProductPopupProps {
    callbackFunction: () => void;
    product: ProductDetailsDTO | undefined;
}

const BuyProductPopup = ({callbackFunction, product}: BuyProductPopupProps) => {
    const[selectedSoundCarriers, setSelectedSoundCarriers] = useState<Map<SoundCarrierDTO, number>>(new Map());

    const updateSelectedSoundCarriers = (soundCarrier: SoundCarrierDTO, amount: number) => {
        let temp = selectedSoundCarriers;
        temp.set(soundCarrier, amount)
        setSelectedSoundCarriers(temp);
    }

    const addToCart = () => {
        if(selectedSoundCarriers.size === 0) {
            alert("You have to select at least one sound carrier!")
        } else {
            selectedSoundCarriers.forEach((amount, selectedSoundCarrier) => {
                let shoppingCartItem: ShoppingCartItem = {
                    productName: product?.name,
                    artistName: product?.artistName,
                    soundCarrerId: selectedSoundCarrier.soundCarrierId,
                    soundCarrierType: selectedSoundCarrier.soundCarrierName,
                    pricePerCarrier: selectedSoundCarrier.pricePerCarrier,
                    selectedAmount: amount
                };

                if(!shoppingCart.includes(shoppingCartItem)) {
                    shoppingCart.push(shoppingCartItem);
                }
            });
        }
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
                            <button className='btn custom-btn close-btn' onClick={() => callbackFunction()}>Close</button>
                        </div>
                    </div>
                    <div className="row content">
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
                                                                value={selectedSoundCarriers.get(soundCarrier)} 
                                                                min="0" 
                                                                max={soundCarrier.amountAvailable}
                                                                onChange={(event) => updateSelectedSoundCarriers(soundCarrier, parseInt(event.target.value))}
                                                            />
                                                        </td>
                                                    </tr>  
                                            )
                                        }
                                    </tbody>
                                </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-12'>
                        <button className="btn custom-btn" onClick={() => addToCart()}> 
                                Add to cart 
                        </button>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
}

export default BuyProductPopup;