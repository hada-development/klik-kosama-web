declare namespace AnnouncementFeature {
    type AnnouncementListItem = {
        id?: number;
        title?: string;
        description?: string;
        status?: string;
        image?: {
            address: string;
            thumbnail: string;
        };
    };

    type AnnouncementList = {
        current_page?: number;
        total?:number;
        data?: AnnouncementListItem[];
    };
}