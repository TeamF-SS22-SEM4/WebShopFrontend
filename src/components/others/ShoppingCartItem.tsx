export class ShoppingCartItem {
    productName: string | undefined;
    artistName: string | undefined;
    soundCarrierId: string | undefined;
    soundCarrierType: string | undefined;
    pricePerCarrier: number | undefined;
    amountAvailable: number | undefined;
    selectedAmount: number;

    constructor(
        productName: string | undefined,
        artistName: string | undefined,
        soundCarrierId: string | undefined,
        soundCarrierType: string | undefined,
        pricePerCarrier: number | undefined,
        amountAvailable: number | undefined,
        selectedAmount: number)
    {
            this.productName = productName;
            this.artistName = artistName;
            this.soundCarrierId = soundCarrierId;
            this.soundCarrierType = soundCarrierType;
            this.pricePerCarrier = pricePerCarrier;
            this.amountAvailable = amountAvailable;
            this.selectedAmount = selectedAmount;
    }
}