import {useEffect, useState} from "react";
import {GetProductRequest, ProductDetailsDTO, ProductOverviewDTO, SearchProductsRequest} from "../../openapi-client";
import {apiClient} from "../../App";
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import DetailModal from "../modals/DetailModal";
import BuyModal from "../modals/BuyModal";

const HomePage = () => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [products, setProducts] = useState<ProductOverviewDTO[]>([]);
    const [productDetail, setProductDetail] = useState<ProductDetailsDTO>();

    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
    const [allProductsLoaded, setAllProductsLoaded] = useState<boolean>(false);
    const [isLoadingProductDetail, setIsLoadingProductDetail] = useState<boolean>(false);
    const [displayDetailModal, setDisplayDetailModal] = useState<boolean>(false);
    const [displayBuyModal, setDisplayBuyModal] = useState<boolean>(false);


    useEffect(() => {
        fetchProducts(true);

        function closeByEsc(e: any) {
            if(e.key === 'Escape'){
                closeDetailModal();
                closeBuyModal();
            }
        }

        function closeByOutsideClick(event: any) {
            if (!event.target.closest(".modal-dialog") && event.target.closest(".modal-outer")) {
                closeDetailModal();
                closeBuyModal();
            }
        }

        window.addEventListener('keydown', closeByEsc);
        window.addEventListener('click', closeByOutsideClick);

        return () => {
            window.addEventListener('keydown', closeByEsc);
            window.addEventListener('click', closeByOutsideClick);
        }
    }, []);

    function showDetailModal(productId: string | undefined) {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setTimeout(function() {
                setDisplayDetailModal(true);
            }, 150);
        }
    }

    function closeDetailModal () {
        setProductDetail(undefined);
        setDisplayDetailModal(false);
    }

    function showBuyModal (productId: string | undefined) {
        if(productId !== undefined) {
            fetchProductDetails(productId);
            setTimeout(function() {
                setDisplayBuyModal(true);
            }, 150);
        }
    }

    function closeBuyModal () {
        setProductDetail(undefined);
        setDisplayBuyModal(false);
    }

    function fetchProducts(searchButtonClicked: boolean) {
        setIsLoadingProducts(true);

        let tempPageNumber = pageNumber;

        if (searchButtonClicked) {
            tempPageNumber = 1;
            setPageNumber(tempPageNumber);
        }

        const searchProductsRequest: SearchProductsRequest = {
            search: searchTerm,
            pageNumber: tempPageNumber
        };

        apiClient.searchProducts(searchProductsRequest).then(result => {
            if(result.length < 19){
                setAllProductsLoaded(true);
                setPageNumber(1);
            }
            if (searchButtonClicked) {
                setProducts(result);
                setAllProductsLoaded(false);
                setPageNumber(tempPageNumber + 1);
            } else {
                let other: ProductOverviewDTO[] = products.concat(result);
                setProducts(other);
            }

            setIsLoadingProducts(false);
        }).catch(() => {
            // Returns empty list if nothing is found so nothing to do here
            // fetchProducts(false);
        });
    }

    function fetchProductDetails(productId: string) {
        setIsLoadingProductDetail(true);
        const getProductRequest: GetProductRequest = {id: productId};
        apiClient.getProduct(getProductRequest).then(result => {
            setProductDetail(result);
            setIsLoadingProductDetail(false);
        }).catch(response => {
            // TODO: Visual Feedback
            if (response.status === 404) {
                console.log("Productdetails not found");
            }
        });
    }

    function scrollHandler (e: any) {
        if(e.scrollTop + e.offsetHeight >= e.scrollHeight) {
            if (products.length > 0 && !allProductsLoaded) {
                let tempPageNumber = pageNumber;
                setPageNumber(tempPageNumber + 1);
                fetchProducts(false);
            }
        }
    }

    return (
        <>
        <div className="content">
            <div className="container h-100 pb-5">
                <div className="row w-50 m-auto" style={{"height": "20%"}}>
                    <div className="col align-self-center input-group">
                        <input className="form-control" placeholder="Search" type="text" onKeyDown={e => e.key === 'Enter' && fetchProducts(true)} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="btn btn-p" onClick={() => {fetchProducts(true)}}><FaSearch className="d-flex" size={20}></FaSearch></button>
                    </div>
                </div>
                    <>
                        { products.length <= 0 ?
                            <div className="row justify-content-center h-25">
                                <span className="h4 text-center m-auto">No entries found!</span>
                            </div>
                        :
                            <>
                                <div className="justify-content-center table-wrapper" style={allProductsLoaded ? {maxHeight: "80%"} : {maxHeight: "75%"}} onScroll={(e) => scrollHandler(e.target)}>
                                    <table className="table">
                                        <thead className="fixed-head">
                                            <tr>
                                                <th className="py-4 col-3">Album</th>
                                                <th className="py-4 col-3">Artist</th>
                                                <th className="py-4 col-3">Genre</th>
                                                <th className="py-4 col-1 text-center">Release</th>
                                                <th className="py-4 col-1 text-center">Price</th>
                                                <th className="py-4 col-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        { products?.map(
                                            product =>
                                                <tr key={product.productId}>
                                                    <td className="align-middle">{product.name}</td>
                                                    <td className="align-middle">{product.artistName}</td>
                                                    <td className="align-middle">{product.genre}</td>
                                                    <td className="align-middle text-center">{product.releaseYear}</td>
                                                    <td className="align-middle text-center">{product.smallestPrice} €</td>
                                                    <td className="align-middle">
                                                        <div className="d-flex">
                                                            <button className='btn btn-p btn-sm m-1' onClick={() => showDetailModal(product.productId)}>
                                                                Details
                                                            </button>
                                                            <button className='btn btn-s btn-sm m-1' onClick={() => showBuyModal(product.productId)}>
                                                                Buy
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                <div className={(isLoadingProducts && !allProductsLoaded) ? "d-flex p-2 justify-content-center" : "d-flex p-2 justify-content-center invisible"} style={allProductsLoaded ? {height: "0%"} : {height: "5%"}}>
                                    <div className="spinner-border-sm spinner-border align-self-center"></div>
                                </div>
                            </>
                        }
                    </>
            </div>
        </div>
        {displayDetailModal && <DetailModal callbackFunction={closeDetailModal} isLoading={isLoadingProductDetail} product={productDetail}/>}
        {displayBuyModal && <BuyModal callbackFunction={closeBuyModal} isLoading={isLoadingProductDetail} product={productDetail}/>}
    </>
    )
}

export default HomePage;