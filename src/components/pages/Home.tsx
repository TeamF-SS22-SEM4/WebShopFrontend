import {useEffect, useState} from "react";
import {GetProductRequest, ProductDetailsDTO, SearchProductsRequest} from "../../openapi-client";
import {apiClient} from "../../App";
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import DetailModal from "../modals/DetailModal";
import BuyModal from "../modals/BuyModal";

const Home = () => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productDetail, setProductDetail] = useState<ProductDetailsDTO>();

    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
    const [isLoadingProductDetail, setIsLoadingProductDetail] = useState<boolean>(false);
    const [displayDetailModal, setDisplayDetailModal] = useState<boolean>(false);
    const [displayBuyModal, setDisplayBuyModal] = useState<boolean>(false);

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

    function fetchProducts() {
        setIsLoadingProducts(true);
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
            setIsLoadingProducts(false);
        }).catch(() => {});
    }

    function fetchProductDetails(productId: string) {
        setIsLoadingProductDetail(true);
        const getProductRequest: GetProductRequest = {id: productId};
        apiClient.getProduct(getProductRequest).then(result => {
            setProductDetail(result);
            setIsLoadingProductDetail(false);
        }).catch(() => {});
    }

    return (
        <>
        <div className="content">
            <div className="container h-100 pb-5">
                <div className="row w-50 m-auto" style={{"height": "20%"}}>
                    <div className="col align-self-center input-group">
                        <input className="form-control" placeholder="Search" type="text" onKeyDown={e => e.key === 'Enter' && fetchProducts()} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="btn btn-p" onClick={() => {fetchProducts()}}><FaSearch className="d-flex" size={20}></FaSearch></button>
                    </div>
                </div>

                { isLoadingProducts ?
                    <div className="row justify-content-center h-25">
                        <div className="spinner-border align-self-center"></div>
                    </div>
                :
                    <>
                        { products.length <= 0 ?
                            <div className="row justify-content-center h-25">
                                <span className="h4 text-center m-auto">No entry found!</span>
                            </div>

                        :
                            <div className="justify-content-center" style={{"height": "80%"}}>
                                <div className="table-wrapper h-100">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="py-4">Album</th>
                                                <th className="py-4">Artist</th>
                                                <th className="py-4">Genre</th>
                                                <th className="py-4">Release</th>
                                                <th className="py-4">Price</th>
                                                <th className="py-4"></th>
                                                <th className="py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        { products?.map(
                                            product =>
                                                <tr key={product.id}>
                                                    <td className="align-middle">{product.album}</td>
                                                    <td className="align-middle">{product.artist}</td>
                                                    <td className="align-middle">{product.genre}</td>
                                                    <td className="align-middle text-center">{product.release}</td>
                                                    <td className="align-middle text-center">{product.price} €</td>
                                                    <td className="align-middle">
                                                        <button className='btn btn-p btn-sm' onClick={() => showDetailModal(product.id)}>
                                                            Details
                                                        </button>
                                                    </td>
                                                    <td className="align-middle">
                                                        <button className='btn btn-s btn-sm' onClick={() => showBuyModal(product.id)}>
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
            </div>
        </div>
        {displayDetailModal && <DetailModal callbackFunction={closeDetailModal} isLoading={isLoadingProductDetail} product={productDetail}/>}
        {displayBuyModal && <BuyModal callbackFunction={closeBuyModal} isLoading={isLoadingProductDetail} product={productDetail}/>}
    </>
    )
}

export default Home;