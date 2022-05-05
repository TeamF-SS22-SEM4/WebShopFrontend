import './SearchPage.css';
import { useEffect, useState } from "react";
import { ProductDetailsDTO, ProductOverviewDTO, SearchProductsRequest } from "../../openapi-client";
import {apiClient} from "../../App";
import SearchBar from "./SearchBar/SearchBar";
import ProductDetailsPopup from './ProductDetailsPopup';

function SearchPage() {
    const [products, setProducts] = useState<ProductOverviewDTO[]>();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [productId, setProductId] = useState<string | undefined>(undefined);

    useEffect(() => {    
        // After component did mount do initial search
        fetchProducts('a');
    });

    const showPopup = (productId: string | undefined) => {
        setProductId(productId);
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setProductId(undefined);
        setIsPopupOpen(false);
    }

    const fetchProducts = (searchTerm: string) => {
        const searchProductsRequest: SearchProductsRequest = {
            search: searchTerm
        };

        apiClient.searchProducts(searchProductsRequest).then(result => {
            setProducts(result);
        }).catch(reason => {
            //TODO handling
        });
    }

    return (
        <>
            <SearchBar callbackFunction={fetchProducts} />
            <div id="content">
                <table className="table table-hover table-dark">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Artist</th>
                        <th>Genre</th>
                        <th>Release Year</th>
                        <th>Price [from]</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        products?.map(
                            product =>
                            <tr key={product.productId}>
                                <td className="align-middle">{product.name}</td>
                                <td className="align-middle">{product.artistName}</td>
                                <td className="align-middle">{product.genre}</td>
                                <td className="align-middle">{product.releaseYear}</td>
                                <td className="align-middle">{product.smallestPrice} €</td>
                                <td>
                                    <button onClick={() => showPopup(product.productId)}>
                                        Details
                                    </button>
                                </td>
                                <td>
                                    <button>
                                        Buy
                                    </button>
                                </td>
                            </tr>  
                        )
                    }
                    </tbody>
                </table>
            </div>
            {
                isPopupOpen ?
                <ProductDetailsPopup callbackFunction={closePopup} productId={productId}/> :
                null
            }
        </>
    )
}

export default SearchPage