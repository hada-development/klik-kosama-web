import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

const FullscreenToggle: React.FC = () => {
  const toggleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    }
  };

  return (
    <div>
      <Button onClick={toggleFullscreen}>
        {document.fullscreenElement ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </Button>
    </div>
  );
};

export default FullscreenToggle;
