import { BulbOutlined, StarOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DarkModeToggle: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [darkMode, setDarkMode] = useState(initialState?.settings?.navTheme === 'realDark');

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (setInitialState) {
      setInitialState({
        ...initialState,
        settings: {
          ...initialState?.settings,
          navTheme: newDarkMode ? 'realDark' : 'light',
        },
      });
    }
  };

  useEffect(() => {
    // Update the dark mode state when the initialState changes
    setDarkMode(initialState?.settings?.navTheme === 'realDark');
  }, [initialState]);

  return (
    <Switch
      checked={darkMode}
      onChange={toggleDarkMode}
      unCheckedChildren={<StarOutlined />}
      checkedChildren={<BulbOutlined />}
    />
  );
};

export default DarkModeToggle;
