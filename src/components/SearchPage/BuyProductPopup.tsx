import { useState } from 'react';
import { ProductDetailsDTO, SoundCarrierDTO } from '../../openapi-client';
import './SearchPage.css';
import { shoppingCart } from '../ShoppingCartPage/ShoppingCartPage';
import { ShoppingCartItem } from '../utils/ShoppingCartItem';

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
        // Calc sum of selected amount because the amount of every product could be 0
        let sumOfSelectedAmount: number = 0;

        selectedSoundCarriers.forEach((amount) => {
            sumOfSelectedAmount += amount;
        });

        if(selectedSoundCarriers.size === 0 || sumOfSelectedAmount === 0) {
            alert("You have to select at least one sound carrier!")
        } else {
            selectedSoundCarriers.forEach((amount, selectedSoundCarrier) => {
                if(amount !== 0) {
                    let shoppingCartItem = new ShoppingCartItem( 
                        product?.name,
                        product?.artistName,
                        selectedSoundCarrier.soundCarrierId,
                        selectedSoundCarrier.soundCarrierName,
                        selectedSoundCarrier.pricePerCarrier,
                        selectedSoundCarrier.amountAvailable,
                        amount
                    );
    
                    if(shoppingCart.findIndex(item => item.soundCarrerId === shoppingCartItem.soundCarrerId) === -1) {
                        shoppingCart.push(shoppingCartItem);

                        // Should set amount to 0 so the ui refreshes the table and shows 0 
                        // TODO: Fix this 
                        updateSelectedSoundCarriers(selectedSoundCarrier, 0);
                        
                        alert("Added " + shoppingCartItem.selectedAmount + " of " + shoppingCartItem.productName + 
                        "[" + shoppingCartItem.soundCarrierType + "]" + " to cart");
                    } else {
                        alert(shoppingCartItem.productName + "[" + shoppingCartItem.soundCarrierType + "] is already in cart!");
                    }
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