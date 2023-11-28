import { Button, Flex, Modal } from 'antd';
import BwipJs from 'bwip-js';
import { toPng } from 'html-to-image';
import QrCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
const FUNCMAP = {
  checkdigit: 'Check Digit',
};

interface BarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  barcodeValue: string;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({ visible, onClose, barcodeValue }) => {
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null);

  useEffect(() => {
    if (barcodeValue != undefined && barcodeValue.length > 0) {
      const generateImages = async () => {
        const barcodeDataURL = await generate1DBarcode(barcodeValue);
        setBarcodeImage(barcodeDataURL);
      };
      generateImages();
    }
  }, [barcodeValue]);

  const generate1DBarcode = (value: string) => {
    const svgString = BwipJs.toSVG({
      bcid: 'code128',
      text: value,
      scale: 2,
      height: 7,
      includetext: true,
      textxalign: 'center',
    });
    return svgString;
  };

  const handleDownloadBarcode = async () => {
    const dataUrl = await toPng(document.getElementById('barcode-generated')!);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'barcode-' + barcodeValue + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadQRCode = async () => {
    const dataUrl = await toPng(document.getElementById('qrcode')!);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode-' + barcodeValue + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal title="Barcode Details" visible={visible} onCancel={onClose} footer={null} width={400}>
      <Flex align="center" vertical>
        <span>{barcodeValue}</span>
        <h3>1D Barcode</h3>
        {barcodeValue && (
          <div
            style={{ width: '100%' }}
            id="barcode-generated"
            dangerouslySetInnerHTML={{ __html: generate1DBarcode(barcodeValue) }}
          ></div>
        )}

        <Button style={{ marginTop: '8px' }} onClick={handleDownloadBarcode}>
          Download 1D Barcode
        </Button>

        <h3>QR Code</h3>
        <div id="qrcode">
          <QrCode value={barcodeValue} />
        </div>

        <Button style={{ marginTop: '8px' }} onClick={handleDownloadQRCode}>
          Download Qr Code
        </Button>
      </Flex>
    </Modal>
  );
};

export default BarcodeModal;
