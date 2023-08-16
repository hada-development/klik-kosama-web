import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Upload, UploadProps, message } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react"
import './ImageUploadPreview.css';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

export type ImageUploadPreviewProps = {
    valueUrl?: string | undefined
    onChange?: ((info: UploadChangeParam<UploadFile<any>> | null) => void);
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    useEffect(() => {
        setImageUrl(props.valueUrl);
    }, [props.valueUrl, setImageUrl]);

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.originFileObj instanceof Blob) {
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
        if (props.onChange) {
            props.onChange(info);
        }
    }

    const uploadButton = (
        <div className="upload-button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Pilih Gambar</div>
        </div>
    );

    const handleDeleteClick = () => {
        setImageUrl(undefined);
        if (props.onChange) {
            props.onChange(null);
        }
    };

    return (
        <Upload
            listType="picture-card"
            maxCount={1}
            className="custom-upload"
            showUploadList={false}
            accept='image/*'
            beforeUpload={beforeUpload} // Prevent immediate upload
            onChange={handleChange}
        >
            <div className="image-container">
                {imageUrl ?
                    <div className="image-preview">
                        <img src={imageUrl}  alt="avatar" style={{ width: '100%' }} />
                        <Button
                            className="delete-button"
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteClick}
                        />
                    </div>
                    : uploadButton}
            </div>
        </Upload>
    )

}
export default ImageUploadPreview;
