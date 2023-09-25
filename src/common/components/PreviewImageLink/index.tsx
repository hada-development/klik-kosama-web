import { File } from '@/common/data/data';
import { isImageFile } from '@/common/utils/utils';

import { Modal, Typography } from 'antd';
import React, { useState } from 'react';

const { Text, Link } = Typography;

const PreviewImageLink: React.FC<{ file: File; children: any; elipsis?: boolean; width?: any }> = ({
  file,
  children,
  elipsis = false,
  width = 'unset',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleDownload = () => {
    if (isImageFile(file.address)) {
      setPreviewImage(file.address || (file.address as string));
      setPreviewOpen(true);
      setPreviewTitle(file.name);
    } else {
      const anchor = document.createElement('a');
      anchor.href = file.address;
      anchor.download = file.name; // Specify the desired file name
      anchor.click();
    }
  };
  return (
    <>
      <Link ellipsis={elipsis} style={{ width: width }} onClick={handleDownload}>
        {children}
      </Link>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default PreviewImageLink;
