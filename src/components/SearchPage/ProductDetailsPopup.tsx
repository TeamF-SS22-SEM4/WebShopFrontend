import { useEffect, useState } from 'react';
import { apiClient } from '../../App';
import { GetProductRequest, ProductDetailsDTO } from '../../openapi-client';
import './SearchPage.css';

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
    productId: string | undefined;
}

const ProductDetailsPopup = ({callbackFunction, productId}: ProductDetailsPopupProps) => {
    const [product, setProduct] = useState<ProductDetailsDTO>();
    
    useEffect(() => {    
        // After component did mount do initial search
        fetchProductDetails();
    });

    const fetchProductDetails = () => {
        // TODO: Handle undefined in another way
        if(productId !== undefined) {
            const getProductRequest: GetProductRequest = {
                id: productId
            };
    
            apiClient.getProduct(getProductRequest).then(result => {
                setProduct(result);
            }).catch(reason => {
                //TODO handling
            });
        }
    }

    //@Johannes: Add other product information when you style this popup
    return (
        <div className='popup'>
        <div className='popup_inner'>
            <h1>{product?.name}</h1>
            <p>{product?.artistName}</p>
            <p>{product?.genre}</p>
            <button onClick={() => callbackFunction()}>Close</button>
        </div>
      </div>
    )
}

export default ProductDetailsPopup;