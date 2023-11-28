import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { theme } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { addOffice, editOffice } from '../data/services/service';

const mapboxToken =
  'pk.eyJ1IjoiaGF2aWFuc3lhaCIsImEiOiJja3VucWNuNTg0NGNqMnFtYWliYnV4N2pzIn0.X2I0v_kLMf6vCb9liGw_7A';

export type OfficeFormProps = {
  onCancel: (flag?: boolean, formVals?: OfficeFeature.OfficeListItem) => void;
  onSubmit: (values: OfficeFeature.OfficeListItem) => Promise<boolean>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  values?: Partial<OfficeFeature.OfficeListItem>;
};

const OfficeForm: React.FC<OfficeFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const { token } = theme.useToken();

  const [viewport, setViewport] = useState({
    latitude: -6.218855,
    longitude: 106.802293,
    zoom: 10,
  });

  useEffect(() => {
    // Set initial values when the modal is opened
    if (props.open && props.values) {
      formRef.current?.setFieldsValue(props.values);
      setViewport({
        latitude: parseFloat(props.values!.latitude!),
        longitude: parseFloat(props.values!.longitude!),
        zoom: 14,
      });
    } else {
      formRef.current?.resetFields();
      setViewport({
        latitude: -6.218855,
        longitude: 106.802293,
        zoom: 14,
      });
    }
  }, [props.open, props.values, formRef, setViewport]);

  const handleSubmit = async (values: OfficeFeature.OfficeListItem) => {
    try {
      if (props.values) {
        await editOffice(props.values.id, values);
      } else {
        await addOffice(values);
      }
      props.onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      props.onCancel();
    }
  };

  const validateCoordinates = async (_: any, value: number | undefined) => {
    // Custom validation logic for latitude and longitude
    if (value === undefined) {
      return Promise.reject(new Error('Please enter a value'));
    }

    if (value < -90 || value > 90) {
      return Promise.reject(new Error('Latitude must be between -90 and 90'));
    }

    // Add similar validation for longitude if needed

    // If validation passes, resolve the Promise
    return Promise.resolve();
  };

  return (
    <ModalForm
      title={props.values != undefined ? 'Edit Lokasi kantor' : 'Tambah Lokasi kantor'}
      width="600px"
      formRef={formRef}
      open={props.open}
      onOpenChange={props.setOpen}
      initialValues={{ name: props.values?.name }}
      onFinish={async (value) => {
        await handleSubmit(value);
        props.setOpen!(false);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: 'Office Name Is Required',
          },
        ]}
        placeholder="Masukkan Nama Lokasi kantor"
        name="name"
        label="Nama Lokasi kantor"
      />

      <ProFormTextArea
        rules={[
          {
            required: true,
            message: 'Alamat Is Required',
          },
        ]}
        placeholder="Masukkan Alamat Lokasi kantor"
        name="address"
        label="Alamat Lokasi kantor"
      />

      <div
        style={{
          fontSize: '16px',
          color: token.colorTextHeading,
          marginBottom: '12px',
        }}
      >
        Pin Lokasi Kantor
      </div>

      <ReactMapGL
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: 14,
        }}
        // onMove={evt => setViewport(evt.viewState)}
        onZoom={(evt) =>
          setViewport({
            ...viewport,
            zoom: evt.viewState.zoom,
          })
        }
        viewState={{
          longitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: viewport.zoom,
          bearing: 0,
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
          pitch: 0,
          width: 550,
          height: 180,
        }}
        style={{ width: 550, height: 180 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {props.values?.longitude != undefined && props.values?.latitude != undefined && (
          <Marker
            longitude={parseFloat(props.values!.longitude)}
            latitude={parseFloat(props.values!.latitude)}
            anchor="bottom"
            color="#0085FF"
          />
        )}
      </ReactMapGL>
      <div style={{ marginTop: '20px' }}>
        <ProForm.Group>
          <ProFormDigit
            width="sm"
            fieldProps={{
              precision: 6, // Number of decimal places for latitude
            }}
            rules={[{ required: true, message: 'Please enter latitude' }]}
            min={-90}
            max={90}
            placeholder="Masukkan latitude (Diawali -6)"
            name="latitude"
            label="Latitude"
          />

          <ProFormDigit
            width="sm"
            fieldProps={{
              precision: 6, // Number of decimal places for longitude
            }}
            rules={[{ required: true, message: 'Please enter longitude' }]}
            placeholder="Masukkan Longitude"
            name="longitude"
            label="Longitude"
          />
        </ProForm.Group>

        <ProFormText
          rules={[
            {
              required: true,
              message: 'Radius Is Required',
            },
          ]}
          placeholder="Masukkan Radius"
          name="radius"
          label="Radius (Meter)"
        />
      </div>
    </ModalForm>
  );
};

export default OfficeForm;
