declare namespace PositionFeature {
    type PositionListItem = {
        id?: number;
        name?: boolean;
    };

    type PositionList = {
        current_page?: number;
        total?:number;
        data?: PositionListItem[];
    };
}