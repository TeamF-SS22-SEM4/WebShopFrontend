import './SearchPage.css';
import {useEffect, useState} from "react";
import { GetProductRequest, ProductDetailsDTO, ProductOverviewDTO, SearchProductsRequest } from "../../openapi-client";
import {apiClient} from "../../App";
import SearchBar from "./SearchBar/SearchBar";
import ProductDetailsPopup from './ProductDetailsPopup';
import BuyProductPopup from './BuyProductPopup';

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState<string>('a');
    const [products, setProducts] = useState<ProductOverviewDTO[]>([]);
    const [product, setProduct] = useState<ProductDetailsDTO | undefined>();
    const [isProductDetailsShown, setIsProductDetailsShown] = useState<boolean>(false);
    const [isBuyProductShown, setIsBuyProductShown] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [allProductsLoaded, setAllProductsLoaded] = useState<boolean>(false);

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

    const fetchProducts = (isSearchButtonClicked: boolean) => {
        let tempPageNumber = pageNumber;

        if(isSearchButtonClicked) {
            tempPageNumber = 1;
            setPageNumber(tempPageNumber);
        }

        const searchProductsRequest: SearchProductsRequest = {
            search: searchTerm,
            pageNumber: tempPageNumber // Use tempPageNumber because setPageNumber is asynchronous
        };

        apiClient.searchProducts(searchProductsRequest).then(result => {
            if(result.length === 0){
                setPageNumber(1);
                setAllProductsLoaded(true);
            }

            if (isSearchButtonClicked) {
                setAllProductsLoaded(false);
                setPageNumber(tempPageNumber + 1);
                setProducts(result);
            } else {
                let productList: ProductOverviewDTO[] = products.concat(result);
                setProducts(productList);
            }
        }).catch(() => {
            // Should only return 200 or a empty list
        });
    }

    const fetchProductDetails = (productId: string) => {
        const getProductRequest: GetProductRequest = {
            id: productId
        };

        apiClient.getProduct(getProductRequest).then(result => {
            setProduct(result);
        }).catch(response => {
            if (response.status === 403) {
                alert("Not Authenticated");
            } else if (response.status === 401) {
                alert("Unauthorized for operation");
            } else if (response.status === 403) {
                alert("Unknown product id");
            } else {
                alert("Something went wrong...");
            }
        });
    }

    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            // you're at the bottom of the page
            if (products.length > 0 && !allProductsLoaded) {
                let tempPageNumber = pageNumber;
                setPageNumber(tempPageNumber + 1);
                fetchProducts(false);
            }
        }
    };

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
                        <button className="btn custom-btn" onClick={() => fetchProducts(true)}>Search</button>
                    </div>
                </div>
                <div className="row productListContainer">
                    <div className="col-12">
                        <table className="table table-hover table-dark custom-table">
                            <thead className="custom-table-head">
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