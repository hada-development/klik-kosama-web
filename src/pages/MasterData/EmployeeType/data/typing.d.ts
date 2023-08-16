declare namespace EmployeeTypeFeature {
    type EmployeeTypeListItem = {
        id?: number;
        name?: boolean;
    };

    type EmployeeTypeList = {
        current_page?: number;
        total?:number;
        data?: EmployeeTypeListItem[];
    };
}