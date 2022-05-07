import { useEffect, useState } from "react";
import { ShoppingCartItem } from "../utils/ShoppingCartItem";

const ShoppingCartPage = () => {
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {     
        calculateTotalPrice();
    });

    const calculateTotalPrice = () => {
        let total: number = 0;

        shoppingCart?.forEach((shoppingCartItem) => {
            if(shoppingCartItem.pricePerCarrier !== undefined) {
                total += shoppingCartItem.selectedAmount * shoppingCartItem.pricePerCarrier;
            }
        });

        setTotalPrice(total);
    }

    const updateSelectedAmount = (shoppingCartItem: ShoppingCartItem, newAmount: number) => {
        if(shoppingCartItem !== undefined) {
            let newShoppingCartItem = new ShoppingCartItem(
                shoppingCartItem.productName,
                shoppingCartItem.artistName,
                shoppingCartItem.soundCarrerId,
                shoppingCartItem.soundCarrierType,
                shoppingCartItem.pricePerCarrier,
                shoppingCartItem.amountAvailable,
                newAmount
            );

            let oldItemIndex = shoppingCart.indexOf(shoppingCartItem);
            shoppingCart[oldItemIndex] = newShoppingCartItem;

            calculateTotalPrice();
        }
    }

    const removeProductFromCart = (shoppingCartItem: ShoppingCartItem) => {
        let index = shoppingCart?.indexOf(shoppingCartItem);

        if(index !== -1 && index !== undefined) {
            shoppingCart.splice(index, 1);
        }
        
        calculateTotalPrice();
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="pageTitle">Shopping Cart</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <table className="table table-hover table-dark">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Artist</th>
                                <th>Sound Carrier</th>
                                <th>Price per Carrier</th>
                                <th>Selected Amount</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                shoppingCart?.map(
                                    shoppingCartItem =>
                                    <tr key={shoppingCartItem.soundCarrerId}>
                                        <td className="align-middle">{shoppingCartItem.productName}</td>
                                        <td className="align-middle">{shoppingCartItem.artistName}</td>
                                        <td className="align-middle">{shoppingCartItem.soundCarrierType}</td>
                                        <td className="align-middle">{shoppingCartItem.pricePerCarrier} €</td>
                                        <td>
                                            <input 
                                                type="number"
                                                value={shoppingCartItem.selectedAmount} 
                                                min="1" 
                                                max={shoppingCartItem.amountAvailable}
                                                onChange={(event) => updateSelectedAmount(shoppingCartItem, parseInt(event.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => removeProductFromCart(shoppingCartItem)} className='btn btn-danger'>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>  
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="standardText">Total: {totalPrice} €</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export const shoppingCart: ShoppingCartItem[] = [];
export default ShoppingCartPage;


