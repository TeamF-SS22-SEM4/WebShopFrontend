import {useEffect, useState} from "react";
import {GetProductRequest, ProductDetailsDTO, SearchProductsRequest} from "../../openapi-client";
import {apiClient} from "../../App";
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import ProductDetailsPopup from "../modals/DetailModal";
import BuyProductPopup from "../modals/BuyModal";

//TODO: einheitlihc function oder const

function Home() {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [productsLoading, setProductsLoading] = useState<boolean>(false);
    const [productDetailsLoading, setProductDetailsLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<ProductDetailsDTO>();

    const [isProductDetailsShown, setIsProductDetailsShown] = useState<boolean>(false);
    const [isBuyProductShown, setIsBuyProductShown] = useState<boolean>(false);

    type Product = {
        id: string,
        album: string,
        artist: string,
        genre: string,
        release: string,
        price: number,
    }

    useEffect(() => {
        fetchProducts();

        const close = (e: any) => {
            if(e.key === 'Escape'){
                closeProductDetails();
                closeBuyProduct();
            }
        }

        function test(event: any) {
            if (!event.target.closest(".modal-dialog") && event.target.closest(".modal-outer")) {
                closeProductDetails();
                closeBuyProduct();
            }
        }

        window.addEventListener('click', test);
        window.addEventListener('keydown', close);


        return () => {
            window.removeEventListener('keydown', close);
            window.removeEventListener('click', test);
        }
    }, []);


    function fetchProducts() {
        setProductsLoading(true);
        const searchProductsRequest: SearchProductsRequest = {search: searchTerm};

        apiClient.searchProducts(searchProductsRequest).then(result => {
            let products: Product[] = [];

            result.forEach((element) => {
                if (element.productId && element.name && element.artistName && element.genre && element.releaseYear && element.smallestPrice) {
                    let product: Product = {
                        id: element.productId,
                        album: element.name,
                        artist: element.artistName,
                        genre: element.genre,
                        release: element.releaseYear,
                        price: element.smallestPrice,
                    }
                    products.push(product);
                }
            })

            products.sort((a,b) => (a.album > b.album) ? 1 : ((b.album > a.album) ? -1 : 0));
            setProducts(products);
            setProductsLoading(false);
        }).catch(() => {});
    }

    function fetchProductDetails(productId: string) {
        setProductDetailsLoading(true);
        const getProductRequest: GetProductRequest = {id: productId};

        apiClient.getProduct(getProductRequest).then(result => {
            setProductDetail(result);
            setProductDetailsLoading(false);
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

    const showProductDetails = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setTimeout(function() {
                setIsProductDetailsShown(true);
            }, 150);
        }
    }

    const showBuyProduct = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setTimeout(function() {
                setIsBuyProductShown(true);
            }, 150);
        }
    }

    const closeProductDetails = () => {
        setProductDetail(undefined);
        setIsProductDetailsShown(false);
    }

    const closeBuyProduct = () => {
        setProductDetail(undefined);
        setIsBuyProductShown(false);
    }

    return (
        <>
        <div className="content">
            <div className="container h-100 pb-5">
                <div className="row w-50 m-auto" style={{"height": "20%"}}>
                    <div className="col align-self-center input-group">
                        <input className="form-control" placeholder="Search" type="text" onKeyDown={e => e.key === 'Enter' && fetchProducts()} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="btn btn-primary" onClick={() => {fetchProducts()}}><FaSearch className="d-flex" size={20}></FaSearch></button>
                    </div>
                </div>

                {productsLoading ?
                    <div className="row justify-content-center h-25">
                        <div className="spinner-border align-self-center"></div>
                    </div>
                :
                    <>
                        {products.length <= 0 ?
                            <div className="row justify-content-center h-25">
                                <span className="h3 text-center m-auto">No entry found!</span>
                            </div>

                            :
                            <div className="justify-content-center" style={{"height": "80%"}}>
                                <div className="tableContainer h-100">
                                    <table className="table">
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
                                                    <tr key={product.id}>
                                                        <td className="align-middle">{product.album}</td>
                                                        <td className="align-middle">{product.artist}</td>
                                                        <td className="align-middle">{product.genre}</td>
                                                        <td className="align-middle">{product.release}</td>
                                                        <td className="align-middle">{product.price} €</td>
                                                        <td className="align-middle">
                                                            <button className='btn btn-primary btn-sm' onClick={() => showProductDetails(product.id)}>
                                                                Details
                                                            </button>
                                                        </td>
                                                        <td className="align-middle">
                                                            <button className='btn btn-success btn-sm' onClick={() => showBuyProduct(product.id)}>
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
                        }
                    </>
                }

                {/*TODO: was ist wenn modal content noch nicht da ist*/}
            </div>
        </div>
        {isProductDetailsShown && <ProductDetailsPopup callbackFunction={closeProductDetails} isLoading={productDetailsLoading} product={productDetail}/>}
        {isBuyProductShown && <BuyProductPopup callbackFunction={closeBuyProduct} isLoading={productDetailsLoading} product={productDetail}/>}
    </>
    )
}

export default Home;