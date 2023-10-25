import { EditableProTable, ProFormSelect } from '@ant-design/pro-components';
import { getProductDataTable } from '../../MasterData/Product/data/services';
import { PurchaseItem } from '../data/data';

const EditableTable: React.FC = () => {
  return (
    <EditableProTable<PurchaseItem>
      rowKey="key"
      headerTitle="Editable Table"
      columns={[
        {
          title: 'Product ID',
          dataIndex: 'product_id',
          renderFormItem: (_, { isEditable }) => {
            return (
              <ProFormSelect
                request={async (params, props) =>
                  (await getProductDataTable(params)).data.map((e) => {
                    return {
                      label: e.name,
                      value: e.id,
                    };
                  })
                }
              />
            );
          },
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          valueType: 'digit',
        },
        {
          title: 'Unit Price (IDR)',
          dataIndex: 'unit_price',
          valueType: 'money',
        },
      ]}
    />
  );
};

export default EditableTable;
