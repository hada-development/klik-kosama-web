declare namespace EducationLevelFeature {
    type EducationLevelListItem = {
        id?: number;
        name?: boolean;
    };

    type EducationLevelList = {
        current_page?: number;
        total?:number;
        data?: EducationLevelListItem[];
    };
}