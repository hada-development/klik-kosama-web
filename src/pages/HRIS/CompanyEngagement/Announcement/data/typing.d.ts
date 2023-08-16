declare namespace AnnouncementFeature {
    type AnnouncementListItem = {
        id?: number;
        title?: string;
        description?: string;
        status?: string;
        created_at?: string;
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