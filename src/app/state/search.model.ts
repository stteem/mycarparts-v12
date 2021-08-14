export interface SearchResult {
    result: SearchResult[];
}

export interface Result {
    description: string;
    _id: string;
    shopname: string;
    state: string;
    lga: string;
    address: string;
    telnum: string;
    email: string;
    owner: string;
    items: Items[];
    createdAt: string;
    updatedAt: string;
}


export interface Items {
    _id: string;
    storeid: string;
    vehicletype: string;
    model: string;
    year: string;
    part: string;
    price: number;
    weight: string;
    imageurl: string;
    shopname: string;
    address: string;
    city: string;
    state: string;
    telnum: string;
    imageid: string;
    createdAt: string;
    updatedAt: string;
}