const ShoppingCartPage = () => {
    return (
        <>
             <div>
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
                            shoppingCart.map(
                                shoppingCartItem =>
                                <tr key={shoppingCartItem.soundCarrerId}>
                                    <td className="align-middle">{shoppingCartItem.productName}</td>
                                    <td className="align-middle">{shoppingCartItem.artistName}</td>
                                    <td className="align-middle">{shoppingCartItem.soundCarrierType}</td>
                                    <td className="align-middle">{shoppingCartItem.pricePerCarrier} €</td>
                                    <td className="align-middle">{shoppingCartItem.selectedAmount}</td>
                                    <td>
                                        <button onClick={() => shoppingCart.filter(item => item !== shoppingCartItem)} className='btn btn-danger'>
                                            Remove
                                        </button>
                                    </td>
                                </tr>  
                            )
                        }
                        </tbody>
                    </table>
             </div>
        </>
    );
}

// setup global ShoppingCartItem
export interface ShoppingCartItem {
    productName: string | undefined;
    artistName: string | undefined;
    soundCarrerId: string | undefined;
    soundCarrierType: string | undefined;
    pricePerCarrier: number | undefined;
    selectedAmount: number;
}

export const shoppingCart: ShoppingCartItem[] = [];
export default ShoppingCartPage;


