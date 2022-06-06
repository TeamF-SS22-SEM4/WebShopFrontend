import React from "react";

const PurchasesPage = () => {

    return (
        <div className="content">
            <div className="container h-100 py-5">
                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a1" aria-expanded="false">
                                <div className="col">
                                    R000001
                                </div>
                                <div className="col text-center">
                                    07.07.2022 - 14:12
                                </div>
                                <div className="col text-end">
                                    240 €&nbsp;&nbsp;&nbsp;
                                </div>
                            </button>
                        </h2>
                        <div id="a1" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <table className="table">
                                    <thead className="">
                                    <tr>
                                        <th className="col">Album</th>
                                        <th className="col">Artist</th>
                                        <th className="col">Type</th>
                                        <th className="col-2">Amount</th>
                                        <th className="col-1 text-end">Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a2" aria-expanded="false">
                                <div className="col">
                                    R000001
                                </div>
                                <div className="col text-center">
                                    07.07.2022 - 14:12
                                </div>
                                <div className="col text-end">
                                    240 €&nbsp;&nbsp;&nbsp;
                                </div>
                            </button>
                        </h2>
                        <div id="a2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <table className="table">
                                    <thead className="">
                                    <tr>
                                        <th className="col">Album</th>
                                        <th className="col">Artist</th>
                                        <th className="col">Type</th>
                                        <th className="col-2">Amount</th>
                                        <th className="col-1 text-end">Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a3" aria-expanded="false">
                                <div className="col">
                                    R000001
                                </div>
                                <div className="col text-center">
                                    07.07.2022 - 14:12
                                </div>
                                <div className="col text-end">
                                    240 €&nbsp;&nbsp;&nbsp;
                                </div>
                            </button>
                        </h2>
                        <div id="a3" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <table className="table">
                                    <thead className="">
                                    <tr>
                                        <th className="col">Album</th>
                                        <th className="col">Artist</th>
                                        <th className="col">Type</th>
                                        <th className="col-2">Amount</th>
                                        <th className="col-1 text-end">Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">Album</td>
                                        <td className="align-middle">Artist</td>
                                        <td className="align-middle">CD</td>
                                        <td className="align-middle">5</td>
                                        <td className="align-middle text-end">120€</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PurchasesPage;