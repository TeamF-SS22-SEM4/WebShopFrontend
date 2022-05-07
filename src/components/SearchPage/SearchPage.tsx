import './SearchPage.css';
import { useState } from "react";
import { GetProductRequest, ProductDetailsDTO, ProductOverviewDTO, SearchProductsRequest } from "../../openapi-client";
import {apiClient} from "../../App";
import SearchBar from "./SearchBar/SearchBar";
import ProductDetailsPopup from './ProductDetailsPopup';
import BuyProductPopup from './BuyProductPopup';

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState<string>('a');
    const [products, setProducts] = useState<ProductOverviewDTO[]>();
    const [product, setProduct] = useState<ProductDetailsDTO | undefined>();
    const [isProductDetailsShown, setIsProductDetailsShown] = useState<boolean>(false);
    const [isBuyProductShown, setIsBuyProductShown] = useState<boolean>(false);

    const showProductDetails = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setIsProductDetailsShown(true);
        }
    }

    const closeProductDetails = () => {
        setProduct(undefined);
        setIsProductDetailsShown(false);
    }

    const showBuyProduct = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setIsBuyProductShown(true);
        }
    }

    const closeBuyProduct = () => {
        setProduct(undefined);
        setIsBuyProductShown(false);
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

    const fetchProductDetails = (productId: string) => {
        const getProductRequest: GetProductRequest = {
            id: productId
        };

        apiClient.getProduct(getProductRequest).then(result => {
            setProduct(result);
        }).catch(reason => {
            //TODO handling
        });
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="pageTitle">Explore the music of Tomify!</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <SearchBar callbackFunction={setSearchTerm} />
                    </div>
                    <div className="col-2">
                        <button className="btn custom-btn" onClick={() => fetchProducts(searchTerm)}>Search</button>
                    </div>
                </div>
                <div className="row productListContainer">
                    <div className="col-12">
                        <table className="table table-hover table-dark productTable">
                            <thead className="tableHead">
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
                                            <button className='btn custom-btn' onClick={() => showProductDetails(product.productId)}>
                                                Details
                                            </button>
                                        </td>
                                        <td>
                                            <button className='btn custom-btn' onClick={() => showBuyProduct(product.productId)}>
                                                Buy
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
            {
                isProductDetailsShown ?
                <ProductDetailsPopup callbackFunction={closeProductDetails} product={product}/> :
                null
            }
            {
                isBuyProductShown ?
                <BuyProductPopup callbackFunction={closeBuyProduct} product={product}/> :
                null
            }
        </>
    )
}

export default SearchPage