declare namespace OfficeFeature {
    type OfficeListItem = {
        id?: number;
        name?: boolean;
        address?: string;
        latitude?: string;
        longitude?: string;
        radius?: string;
    };

    type OfficeList = {
        current_page?: number;
        total?: number;
        data?: OfficeListItem[];
    };
}