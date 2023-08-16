declare namespace EmployeeFeature {
    type EmployeeListItem = {
        id?: number;
        name?: boolean;
        hr_employee_type_id?: number;
        hr_position_id?: number;
        hr_office_id?: number;
        hr_education_level_id?: number;
        nip?: string;
        join_date?: string;
        education_note?: string;
        position: PositionFeature.PositionListItem;
        employee_type: EmployeeTypeFeature.EmployeeTypeListItem;
        user: {
            id? :number;
            name?: string;
        }
    };

    type EmployeeList = {
        current_page?: number;
        total?: number;
        data?: EmployeeListItem[];
    };
}