import {useContext, useEffect, useState} from "react";
import {GetProductRequest, ProductDetailsDTO, SearchProductsRequest, SoundCarrierDTO} from "../openapi-client";
import {apiClient, ShoppingCartContext} from "../App";
import React from 'react';
import { FaSearch } from 'react-icons/fa'
import {ShoppingCartItem} from "./ShoppingCartItem";
import {shoppingCart} from "./ShoppingCartPage";

function SearchPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<TableEntry[]>([]);
    const [product, setProduct] = useState<ProductDetailsDTO | undefined>();

    let searchTerm = "a";

    useEffect(() => {
        fetchProducts();
    }, []);


    const showProductDetails = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
        }
    }

    const showBuyProduct = (productId: string | undefined) => {
        if(productId !== undefined) {
            fetchProductDetails(productId);
        }
    }

    type TableEntry = {
        id: string,
        album: string,
        artist: string,
        genre: string,
        release: string,
        price: number,
    }

    function fetchProducts() {

        setIsLoading(true);

        const searchProductsRequest: SearchProductsRequest = {
            search: searchTerm
        };

        apiClient.searchProducts(searchProductsRequest).then(result => {

            let tableEntries: TableEntry[] = [];
            result.forEach((element) => {

                if ((element.productId && element.name && element.artistName && element.genre && element.releaseYear && element.smallestPrice)) {
                    let tableEntry:TableEntry = {
                        id: element.productId,
                        album: element.name,
                        artist: element.artistName,
                        genre: element.genre,
                        release: element.releaseYear,
                        price: element.smallestPrice,
                    }
                    tableEntries.push(tableEntry);
                }
            })


            tableEntries.sort((a,b) => (a.album > b.album) ? 1 : ((b.album > a.album) ? -1 : 0))
            setProducts(tableEntries);
            setIsLoading(false);
        }).catch(() => {
            // // Should only return 200 or a empty list
            // alert("Something went wrong...");
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







    const[selectedSoundCarriers, setSelectedSoundCarriers] = useState<Map<SoundCarrierDTO, number>>(new Map());
    const shoppingCartContext = useContext(ShoppingCartContext);

    const[feedbackText, setFeedbackText] = useState<string>("initial");
    const[feedbackTextVisible, setFeedBackTextVisible] = useState<boolean>(false);



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
            setFeedbackText("feeeeeed");
            setFeedBackTextVisible(true);

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
                        shoppingCartContext.setItems(shoppingCart.length);

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





    // className={ displayEmptyUsernameMsg ? "error-msg": ""}

    return (
        <div className="content">
            <div className="container h-100">

                <div className="p-5 input-group h-25">
                    <input className="form-control" placeholder="Search" type="text" onKeyDown={e => e.key === 'Enter' && fetchProducts()} onChange={(e) => searchTerm = (e.target.value)} />
                    <button className="btn btn-danger" onClick={() => {fetchProducts()}}><FaSearch className="d-flex" size={20}></FaSearch></button>
                </div>

                {isLoading ?
                    <div>
                    <h1>TEST</h1>
                    <div className="spinner-border text-danger" role="status"></div>
                    </div>
                :
                    <>
                        {products.length <= 0 ?
                            // :TODO !!!!!!!!!!!!!!!!!
                            <h1>LEER</h1>
                        :
                        <div className="tableContainer h-75">
                            <table className="table table-hover table-dark custom-table h-100">
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
                                            <tr key={product.id}>
                                                <td className="align-middle">{product.album}</td>
                                                <td className="align-middle">{product.artist}</td>
                                                <td className="align-middle">{product.genre}</td>
                                                <td className="align-middle">{product.release}</td>
                                                <td className="align-middle">{product.price} €</td>
                                                <td>
                                                    <button className='btn btn-danger' onClick={() => showProductDetails(product.id)} data-bs-toggle="modal" data-bs-target="#detailsModal">
                                                        Details
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-danger' onClick={() => showBuyProduct(product.id)} data-bs-toggle="modal" data-bs-target="#buyModal">
                                                        Buy
                                                    </button>
                                                </td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        }
                    </>
                }



                <div className="modal fade" id="detailsModal" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{product?.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">

                                <div className="col-6">
                                    <p>Album {product?.artistName}</p>
                                    <p>Artist {product?.genre}</p>
                                    <p>Genre {product?.releaseYear}</p>
                                    <p>Release {product?.duration}</p>
                                    <p>Label {product?.labelName}</p>
                                </div>
                                <div className="col-6">
                                    <table className="table table-hover table-dark custom-table">
                                        <thead className="custom-table-head">
                                        <tr>
                                            <th>Title</th>
                                            <th>Duration</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            product?.songs?.map(
                                                song =>
                                                    <tr>
                                                        <td className="align-middle">{song.title}</td>
                                                        <td className="align-middle">{song.duration}</td>
                                                    </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal" id="buyModal" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{product?.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body p-3">
                                <table className="table table-dark">
                                    <thead className="custom-table-head">
                                    <tr>
                                        <th>Type</th>
                                        <th>Available</th>
                                        <th>Price</th>
                                        <th>Selected Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        product?.soundCarriers?.map(
                                            soundCarrier =>
                                                <tr key={soundCarrier.soundCarrierId}>
                                                    <td className="align-middle">{soundCarrier.soundCarrierName}</td>
                                                    <td className="align-middle">{soundCarrier.amountAvailable}</td>
                                                    <td className="align-middle">{soundCarrier.pricePerCarrier}€</td>
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
                            <div className="modal-footer justify-content-between">
                                {feedbackTextVisible ?
                                    <p>{feedbackText}</p>
                                    :
                                    <p></p>
                                }
                                <button className="btn btn-danger" onClick={() => addToCart()}>
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage