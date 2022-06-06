import React from "react";

const PurchasesPage = () => {

    return (
        <div className="content">
            <div className="container h-100 py-5">
                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a1" aria-expanded="false">
                                Accordion Item #1
                            </button>
                        </h2>
                        <div id="a1" className="accordion-collapse collapse">
                            <div className="accordion-body bg-warning">
                                test
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a2" aria-expanded="false">
                                Accordion Item #3
                            </button>
                        </h2>
                        <div id="a2" className="accordion-collapse collapse">
                            <div className="accordion-body bg-warning">
                                test
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#a3" aria-expanded="false">
                                Accordion Item #3
                            </button>
                        </h2>
                        <div id="a3" className="accordion-collapse collapse">
                            <div className="accordion-body bg-warning">
                                test
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PurchasesPage;